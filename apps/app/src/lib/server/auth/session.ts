import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './user';

import { generateTokenString } from './cryptography';

import { DB } from '../db';
import { sessionsTable, usersTable } from '../db/tables';

import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

export const SESSION_TOKEN_NAME = 'session';

/**
 * The amount of time a session can be inactive before expiry
 *
 * > 1 week
 */
const TIME_TO_EXPIRE_MS = 1000 * 60 * 60 * 24 * 7;
/**
 * The amount of time where a session will be auto renewed before
 */
const TIME_TO_RENEW_MS = 1000 * 60 * 60 * 3;

export const sessionTokenToSessionId = (sessionToken: string): string =>
	encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));

export interface SessionFlags {
	mfaVerified: boolean;
}

export interface Session extends SessionFlags {
	id: string;
	userId: string;
	expiresAt: Date;
}

export type SessionTokenValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
const SESSION_NULL: SessionTokenValidationResult = { session: null, user: null };

// #region Validate Session
/**
 * Explanation Time!
 *
 * so, you'll notice in this function there is a sessionId and a sessionToken, these are one
 * way linked to eachother through the {@link sessionTokenToSessionId | `sessionTokenToSessionId`} function.
 *
 * We do not store the session token in the database, but rather the session Id, this means if someone comes
 * in and steals all of the session, the data will be useless.
 */
export const validateSessionToken = async (
	sessionToken: string
): Promise<SessionTokenValidationResult> => {
	const sessionId = sessionTokenToSessionId(sessionToken);

	const queryResult = await DB.select({
		sessionId: sessionsTable.id,
		sessionExpiry: sessionsTable.expiresAt,
		sessionMfaVerified: sessionsTable.mfaVerified,

		userId: usersTable.id,
		userGivenName: usersTable.givenName,
		userFamilyName: usersTable.familyName
	})
		.from(sessionsTable)
		.innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
		.where(eq(sessionsTable.id, sessionId));

	if (queryResult.length != 1) {
		return SESSION_NULL;
	} else {
		const query = queryResult[0];

		const session: Session = {
			id: query.sessionId,
			expiresAt: query.sessionExpiry,
			mfaVerified: query.sessionMfaVerified,
			userId: query.userId
		};

		const user: User = {
			id: query.userId,
			givenName: query.userGivenName,
			familyName: query.userFamilyName
		};

		if (Date.now() >= session.expiresAt.getTime()) {
			invalidateSession(session.id);
			return SESSION_NULL;
		}

		if (Date.now() >= session.expiresAt.getTime() - TIME_TO_RENEW_MS) {
			const newExpiryDate = new Date(Date.now() + TIME_TO_EXPIRE_MS);
			session.expiresAt = newExpiryDate;
			await DB.update(sessionsTable)
				.set({ expiresAt: newExpiryDate })
				.where(eq(sessionsTable.id, session.id));
		}

		return {
			session,
			user
		};
	}
};

export const setSessionAsMFAVerified = async (sessionId: string) => {
	await DB.update(sessionsTable)
		.set({
			mfaVerified: true
		})
		.where(eq(sessionsTable.id, sessionId));
};
// #endregion

export const generateSessionToken = generateTokenString;

// #region Generate Session
/**
 *
 * @param userId the ID of the user
 * @param flags flags for the original session
 * @returns
 */
export const createSession = async (
	sessionToken: string,
	userId: string,
	flags: SessionFlags
): Promise<Session> => {
	const sessionId = sessionTokenToSessionId(sessionToken);

	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + TIME_TO_EXPIRE_MS),
		mfaVerified: flags.mfaVerified
	};

	await DB.insert(sessionsTable).values({
		id: sessionId,
		userId,
		expiresAt: session.expiresAt,
		mfaVerified: session.mfaVerified
	});

	return session;
};
// #endregion

// #region Delete Session
export const invalidateSession = async (sessionId: string) => {
	await DB.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
};

export const invalidateUserSessions = async (userId: string) => {
	await DB.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
};

export const deleteSessionToken = (event: RequestEvent) => {
	event.cookies.set(SESSION_TOKEN_NAME, '', {
		httpOnly: true,
		path: '/',
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
};
// #endregion

// #region Set Tokens
export const setSessionToken = (event: RequestEvent, sessionToken: string, expiresAt: Date) => {
	event.cookies.set(SESSION_TOKEN_NAME, sessionToken, {
		httpOnly: true,
		path: '/',
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
};
// #endregion
