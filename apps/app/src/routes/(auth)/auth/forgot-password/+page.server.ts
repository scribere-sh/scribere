import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { generateAndSaveResetChallenge, sendPasswordResetEmail } from '$auth/reset-password';

import { forgotPasswordFormSchema } from '$client/forms';
import { emailAddressTable, usersTable } from '$db/tables';

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(forgotPasswordFormSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const [user] = await event.locals.DB.select({
            id: emailAddressTable.userId,
            displayName: usersTable.displayName
        })
            .from(emailAddressTable)
            .where(eq(emailAddressTable.emailAddress, form.data.email))
            .innerJoin(usersTable, eq(usersTable.id, emailAddressTable.userId));

        if (!user) return;

        await event.locals.DB.transaction(async (tx_db) => {
            const generated = await generateAndSaveResetChallenge(user.id, tx_db);

            await sendPasswordResetEmail(
                form.data.email,
                user.displayName,
                generated.ref,
                generated.token,
                tx_db
            );
        });
    }
};

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(forgotPasswordFormSchema))
    };
};
