import { eq } from 'drizzle-orm';
import { DB } from '../db';
import { emailAddressTable } from '../db/tables';

/**
 * insert an email address into the system and link to a user.
 *
 * > [!NOTE]
 * > This doesn't validate the string, you need to do that yourself
 *
 * @param emailAddress The email address to add
 */
export const insertEmailAddress = async (emailAddress: string, userId: string) => {
	await DB.insert(emailAddressTable).values({
		userId,
		emailAddress,
		isValidated: false,
		challengeRef: null
	});
};

/**
 * Verify that the email address is available
 */
export const verifyEmailAddressAvailability = async (emailAddress: string): Promise<boolean> => {
	const query = await DB.select({ emailAddress: emailAddressTable.emailAddress })
		.from(emailAddressTable)
		.where(eq(emailAddressTable.emailAddress, emailAddress));
	return query.length === 0;
};
