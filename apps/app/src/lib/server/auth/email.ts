import { eq } from 'drizzle-orm';

import { type DB } from '$db';
import { emailAddressTable } from '$db/tables';

/**
 * insert an email address into the system and link to a user.
 *
 * > [!NOTE]
 * > This doesn't validate the string, you need to do that yourself
 *
 * @param emailAddress The email address to add
 */
export const insertEmailAddress = async (db: DB, emailAddress: string, userId: string) => {
    await db.insert(emailAddressTable).values({
        userId,
        emailAddress,
        isValidated: false,
        challengeRef: null
    });
};

/**
 * Verify that the email address is available
 */
export const verifyEmailAddressAvailability = async (
    db: DB,
    emailAddress: string
): Promise<boolean> => {
    const query = await db
        .select({ emailAddress: emailAddressTable.emailAddress })
        .from(emailAddressTable)
        .where(eq(emailAddressTable.emailAddress, emailAddress));
    return query.length === 0;
};
