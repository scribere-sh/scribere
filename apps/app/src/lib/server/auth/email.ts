import { eq } from 'drizzle-orm';

import { getRequestEvent } from '$app/server';
import { type TX } from '$db';
import { emailAddressTable } from '$db/tables';

/**
 * insert an email address into the system and link to a user.
 *
 * > [!NOTE]
 * > This doesn't validate the string, you need to do that yourself
 *
 * @param emailAddress The email address to add
 */
export const insertEmailAddress = async (emailAddress: string, userId: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

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
    emailAddress: string,
    tx_db?: TX
): Promise<boolean> => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const query = await db
        .select({ emailAddress: emailAddressTable.emailAddress })
        .from(emailAddressTable)
        .where(eq(emailAddressTable.emailAddress, emailAddress));

    return query.length === 0;
};
