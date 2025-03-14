import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ulid } from 'ulid';

export const usersTable = sqliteTable('users', {
    /**
     * User ID
     */
    id: text().primaryKey().unique().notNull().$defaultFn(ulid),

    /**
     * The name to display, this can be updated at any time to match what the user wants (discord style)
     */
    displayName: text().notNull(),

    /**
     * The handle name of the user, this will have a restricted character set (i.e. /[a-z0-9.-]/) and will
     * be used for mentioning (discord style).
     */
    handle: text().notNull().unique(),

    /**
     * The date and time this account was created
     */
    createdAt: integer({ mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date(Date.now()))
});

export const authProviderTable = sqliteTable('auth_providers', {
    /**
     * The User that his method will provide for
     */
    userId: text()
        .notNull()
        .references(() => usersTable.id),

    /**
     * The type of method this will provide for
     *
     * includes passwords, oauth methods, email verification tokens, etc.
     */
    type: text().notNull(),

    /**
     * Optional item to give the server a but more necessary context on what is going on
     */
    ref: text(),

    /**
     * Extra context to compare things to
     *
     * For a password, this will be the argon2id hash of the password,
     * for an oauth method this will be an argon2id hash of the user id
     * from the other service (because why not). for email verifications
     * this will be the argon2id hash of the email verification token
     *
     * Overall this should do its best to keep things away
     */
    hash: text()
});

export const twoFactorAuthenticationProviderTable = sqliteTable(
    'two_factor_authentication_providers',
    {
        userId: text()
            .notNull()
            .references(() => usersTable.id),

        type: text().notNull(),

        challenge: text().notNull()
    }
);

export const emailAddressTable = sqliteTable('email_addresses', {
    /**
     * The User that this email connects to
     */
    userId: text()
        .notNull()
        .references(() => usersTable.id),

    /**
     * The address connected to the user, we need this to be unique
     * to prevent email spoofing.
     */
    emailAddress: text().notNull().unique(),

    /**
     * Whether or not the email address is verified
     */
    isValidated: integer({ mode: 'boolean' })
        .notNull()
        .$default(() => false),

    /**
     * if not verified, this will point to a validationRef in the {@link emailValidationChallengeTable | `emailValidationChallengeTable`}
     */
    challengeRef: text()
});

export const emailValidationChallengeTable = sqliteTable('email_verification_requests', {
    emailRef: text(),
    challengeRef: text().notNull(),
    challengeTokenHash: text().notNull()
});

export const passwordResetChallengeTable = sqliteTable('password_reset_challenges', {
    emailRef: text(),
    challengeRef: text().notNull(),
    challengeToken: text().notNull(),
    userId: text()
        .notNull()
        .references(() => usersTable.id),
    expiresAt: integer({ mode: 'timestamp' }).notNull()
});

export const sessionsTable = sqliteTable('sessions', {
    id: text().primaryKey().notNull(),

    userId: text()
        .notNull()
        .references(() => usersTable.id),

    expiresAt: integer({ mode: 'timestamp' }).notNull(),

    mfaVerified: integer({ mode: 'boolean' })
});

export const assetTable = sqliteTable('assets', {
    /**
     * the ID will be the unique identifier of the asset
     */
    id: text().primaryKey().notNull(),
    /**
     * this refers to what created this attachment (for example, is it connected to a space, a user, etc.)
     */
    parentType: text().notNull(),
    /**
     * this refers to the id of parent type, this could link to a space, a page, a user, etc.
     */
    parentId: text().notNull(),
    /**
     * refers to how the UI should access it, this will likely be a blob path within our R2 instance.
     */
    uri: text().notNull(),
    /**
     *
     */
    mimeType: text().notNull()
});
