import type { RequestHandler } from './$types';

import { eq } from 'drizzle-orm';

import { verifyArgon2id } from '$auth/cryptography';

import { emailAddressTable, emailValidationChallengeTable } from '$db/tables';
import { route } from '$routes';

export const GET: RequestHandler = async (event) => {
    const validationRef = event.url.searchParams.get('validation_reference');
    const validationToken = event.url.searchParams.get('token');

    if (!validationRef || !validationToken) {
        return new Response(null, {
            status: 401
        });
    }

    const [challenge] = await event.locals.DB.select({
        challengeArgon: emailValidationChallengeTable.challengeTokenHash
    })
        .from(emailValidationChallengeTable)
        .where(eq(emailValidationChallengeTable.challengeRef, validationRef));

    if (!challenge) {
        console.log('no challenge found');
        return new Response(null, {
            status: 303,
            headers: {
                Location: route('/')
            }
        });
    }

    if (!(await verifyArgon2id(challenge.challengeArgon, validationToken))) {
        console.log('email verification challenge invalid');
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

    console.log('email verification successful, records updated');

    return new Response(null, {
        status: 303,
        headers: {
            Location: route('/')
        }
    });
};
