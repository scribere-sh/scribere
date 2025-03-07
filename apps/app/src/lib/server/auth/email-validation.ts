import { encodeHexLowerCase } from '@oslojs/encoding';

import { sendValidationEmail, type ValidateEmailProps } from '@scribere/email/validateEmail';

import { env } from '$env/dynamic/private';
import { route } from '$lib/ROUTES';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { DB } from '../db';
import { emailAddressTable, emailValidationChallengeTable } from '../db/tables';
import { createArgon2id, generateTokenString, verifyArgon2id } from './cryptography';

export const generateChallengeRef = (emailAddress: string) =>
	encodeHexLowerCase(new TextEncoder().encode(emailAddress));
export const generateChallengeToken = generateTokenString;

export interface EmailAddressChallenge {
	ref: string;
	token: string;
}

/**
 * generate an email validation challenge
 *
 * @param emailAddress The email address to verify and challenge
 */
export const generateEmailValidation = async (
	emailAddress: string
): Promise<EmailAddressChallenge> => {
	const challengeRef = generateChallengeRef(emailAddress);
	const challengeToken = generateChallengeToken();

	const challengeTokenArgon2id = await createArgon2id(challengeToken);

	await DB.insert(emailValidationChallengeTable).values({
		challengeRef,
		challengeTokenHash: challengeTokenArgon2id
	});

	await DB.update(emailAddressTable)
		.set({ challengeRef })
		.where(eq(emailAddressTable.emailAddress, emailAddress));

	return {
		ref: challengeRef,
		token: challengeToken
	};
};

/**
 * send an email validation challenge
 */
export const sendEmailValidationChallenge = async (
	userGivenName: string,
	emailAddress: string,
	reqUrl: URL,
	challenge: EmailAddressChallenge
) => {
	const validationUrl = reqUrl;
	validationUrl.pathname = route('GET /auth/verify-email');
	validationUrl.searchParams.set('ref', challenge.ref);
	validationUrl.searchParams.set('token', challenge.token);

	const props: ValidateEmailProps = {
		apiKey: env.RESEND_API_KEY,

		from: {
			email: env.SENDER_EMAIL,
			name: env.SENDER_NAME
		},
		to: {
			name: userGivenName,
			email: emailAddress
		},

		validationUrl: validationUrl.toString()
	};

	const result = await sendValidationEmail(props);

	if (result.error) throw result.error;

	const emailRef = result.data!.id;

	await DB.update(emailValidationChallengeTable)
		.set({
			emailRef
		})
		.where(eq(emailValidationChallengeTable.challengeRef, challenge.ref));
};

export const verifyEmailValidationRequest = async (event: RequestEvent) => {
	const challengeRef = event.url.searchParams.get('ref');
	const challengeToken = event.url.searchParams.get('token');

	if (!challengeRef || !challengeToken) {
		throw new Error('Validation Challenge ref and/or token not specified');
	}

	const [challenge] = await DB.select({
		challengeToken: emailValidationChallengeTable.challengeTokenHash
	})
		.from(emailValidationChallengeTable)
		.where(eq(emailValidationChallengeTable.challengeRef, challengeRef));

	if (await verifyArgon2id(challenge.challengeToken, challengeToken)) {
		await DB.batch([
			DB.delete(emailValidationChallengeTable).where(
				eq(emailValidationChallengeTable.challengeRef, challengeRef)
			),
			DB.update(emailAddressTable)
				.set({
					challengeRef: null,
					isValidated: true
				})
				.where(eq(emailAddressTable.challengeRef, challengeRef))
		]);
	} else {
		throw new Error('Email validation challenge failed');
	}
};
