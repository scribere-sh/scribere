import { createArgon2id, verifyArgon2id } from './cryptography';
import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { and, eq } from 'drizzle-orm';

import { getRequestEvent } from '$app/server';
import { type TX } from '$db';
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

export const verifyPasswordStrength = async (password: string): Promise<boolean> => {
    const { fetch } = getRequestEvent();

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

export const assignPasswordToUser = async (userId: string, password: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const passwordHash = await createArgon2id(password);

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
    userId: string,
    providedPassword: string,
    tx_db?: TX
) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [password] = await db
        .select({ hash: authProviderTable.hash })
        .from(authProviderTable)
        .where(and(eq(authProviderTable.userId, userId), eq(authProviderTable.type, 'password')));

    if (!password || !password.hash) {
        return false;
    }

    return await verifyArgon2id(password.hash, providedPassword);
};

export const validatePassword = async (storedHash: string, password: string) => {
    return await verifyArgon2id(storedHash, password);
};

export const updateUserPassword = async (userId: string, newPassword: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    await db
        .update(authProviderTable)
        .set({
            hash: await createArgon2id(newPassword)
        })
        .where(and(eq(authProviderTable.type, 'password'), eq(authProviderTable.userId, userId)));
};
