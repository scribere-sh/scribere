import { createArgon2id, verifyArgon2id } from './cryptography';
import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { type DB } from '$db';
import { authProviderTable } from '$db/tables';

/**
 * FOR THE LOVE OF ALL THAT IS HOLY DONT USE THIS TO STORE PASSWORDS
 *
 * THIS IS USED TO LOOK UP PASSWORDS IN A PWNED PASSWORD API
 *
 * @param pw the password
 * @returns the sha1 of the password for validation in pwned passwords
 */
const sha1Password = (pw: string) => encodeHexLowerCase(sha1(new TextEncoder().encode(pw)));

export const verifyPasswordStrength = async (
    password: string,
    { fetch }: RequestEvent
): Promise<boolean> => {
    // todo: check string length?
    // it's done already in the form

    const hash = sha1Password(password);
    const hashPrefix = hash.slice(0, 5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
    const data = await response.text();
    const items = data.split('\n');

    const found = items.find((val) => {
        const hashSuffix = val.slice(0, 35).toLowerCase();
        return hash == hashPrefix + hashSuffix;
    });

    return found === undefined;
};

export const assignPasswordToUser = async (
    db: DB,
    event: RequestEvent,
    userId: string,
    password: string
) => {
    const passwordHash = await createPasswordHash(event, password);

    await db
        .delete(authProviderTable)
        .where(and(eq(authProviderTable.userId, userId), eq(authProviderTable.type, 'password')));

    await db.insert(authProviderTable).values({
        userId,
        type: 'password',
        hash: passwordHash
    });
};

export const verifyPasswordOfUser = async (
    db: DB,
    event: RequestEvent,
    userId: string,
    providedPassword: string
) => {
    const [password] = await db
        .select({ hash: authProviderTable.hash })
        .from(authProviderTable)
        .where(and(eq(authProviderTable.userId, userId), eq(authProviderTable.type, 'password')));

    if (!password || !password.hash) {
        return false;
    }

    return await verifyArgon2id(event, password.hash, providedPassword);
};

export const createPasswordHash = async (event: RequestEvent, password: string) => {
    return await createArgon2id(event, password);
};

export const validatePassword = async (
    event: RequestEvent,
    storedHash: string,
    password: string
) => {
    return await verifyArgon2id(event, storedHash, password);
};

export const updateUserPassword = async (
    db: DB,
    event: RequestEvent,
    userId: string,
    newPassword: string
) => {
    await db
        .update(authProviderTable)
        .set({
            hash: await createArgon2id(event, newPassword)
        })
        .where(and(eq(authProviderTable.type, 'password'), eq(authProviderTable.userId, userId)));
};
