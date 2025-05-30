import { and, eq, type InferSelectModel } from 'drizzle-orm';

import { getRequestEvent } from '$app/server';
import { type TX } from '$db';
import { authProviderTable, usersTable } from '$db/tables';

export type User = InferSelectModel<typeof usersTable>;

export const lookupHandleAvailability = async (handle: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const query = await db
        .select({ handle: usersTable.handle })
        .from(usersTable)
        .where(eq(usersTable.handle, handle));
    return query.length === 0;
};

// #region Create User
/**
 * Generate the user
 *
 * > [!NOTE]
 * > This does not add the email address to the database, you have to do that yourself
 *
 * @param user the new User to create, don't include ID, this is generated by DrizzleORM
 * @returns the new User, including the ID
 */
export const createUser = async (user: Omit<User, 'id' | 'createdAt'>, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [newUser] = await db.insert(usersTable).values(user).returning();

    return newUser;
};
// #endregion

export const lookupUserIdFromOAuthProvider = async (
    providerId: string,
    provider: string,
    tx_db?: TX
) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [userRecord] = await db
        .select({
            userId: authProviderTable.userId
        })
        .from(authProviderTable)
        .where(and(eq(authProviderTable.type, provider), eq(authProviderTable.ref, providerId)));

    if (userRecord) {
        return userRecord.userId;
    } else {
        return null;
    }
};

export const linkOAuthProviderToUser = async (
    providerId: string,
    provider: string,
    userId: string,
    tx_db?: TX
) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [existentRecord] = await db
        .select({
            providerId: authProviderTable.ref
        })
        .from(authProviderTable)
        .where(and(eq(authProviderTable.userId, userId), eq(authProviderTable.type, provider)));

    if (existentRecord) {
        throw new Error('user must unlink this provider first');
    }

    console.log('inserting new value');
    await db.insert(authProviderTable).values({
        type: provider,
        ref: providerId,
        userId
    });
};

export const unlinkOAuthProviderFromUser = async (provider: string, userId: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    await db
        .delete(authProviderTable)
        .where(and(eq(authProviderTable.userId, userId), eq(authProviderTable.type, provider)));
};
