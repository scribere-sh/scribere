import type { RequestHandler } from './$types';

import { eq } from 'drizzle-orm';

import { verifyArgon2id } from '$auth/cryptography';

import { emailAddressTable, emailValidationChallengeTable } from '$db/tables';
import { route } from '$routes';

export const GET: RequestHandler = async (event) => {
    const validationRef = event.url.searchParams.get('ref');
    const validationToken = event.url.searchParams.get('token');

    if (!validationRef || !validationToken) {
        return new Response(null, {
            status: 401
        });
    }

    const [{ challengeArgon }] = await event.locals.DB.select({
        challengeArgon: emailValidationChallengeTable.challengeTokenHash
    })
        .from(emailValidationChallengeTable)
        .where(eq(emailValidationChallengeTable.challengeRef, validationRef));

    if (!(await verifyArgon2id(event, challengeArgon, validationToken))) {
        return new Response(null, {
            status: 400
        });
    }

    await event.locals.DB.batch([
        event.locals.DB.delete(emailValidationChallengeTable).where(
            eq(emailValidationChallengeTable.challengeRef, validationRef)
        ),
        event.locals.DB.update(emailAddressTable)
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
