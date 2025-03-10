import type { RequestHandler } from './$types';

import { route } from '$lib/ROUTES';
import { verifyArgon2id } from '$lib/server/auth/cryptography';
import { DB } from '$lib/server/db';
import { emailAddressTable, emailValidationChallengeTable } from '$lib/server/db/tables';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async (event) => {
	const validationRef = event.url.searchParams.get('ref');
	const validationToken = event.url.searchParams.get('token');

	if (!validationRef || !validationToken) {
		return new Response(null, {
			status: 401
		});
	}

	const [{ challengeArgon }] = await DB.select({
		challengeArgon: emailValidationChallengeTable.challengeTokenHash
	})
		.from(emailValidationChallengeTable)
		.where(eq(emailValidationChallengeTable.challengeRef, validationRef));

	if (!(await verifyArgon2id(event, challengeArgon, validationToken))) {
		return new Response(null, {
			status: 400
		});
	}

	await DB.batch([
		DB.delete(emailValidationChallengeTable).where(
			eq(emailValidationChallengeTable.challengeRef, validationRef)
		),
		DB.update(emailAddressTable)
			.set({
				isValidated: true,
				challengeRef: null
			})
			.where(eq(emailAddressTable.challengeRef, validationRef))
	]);

	return new Response(null, {
		status: 302,
		headers: {
			Location: route('/')
		}
	});
};
