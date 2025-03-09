import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

import { DB } from '$lib/server/db';
import { usersTable } from '$lib/server/db/tables';

import { t } from '$lib/server/trpc';
import { authMiddleware } from '$lib/server/trpc/middleware';

const router = t.router({
	loadCurrentUserProfile: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
		const [user] = await DB.select().from(usersTable).where(eq(usersTable.id, ctx.user.id));

		if (!user) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message:
					'Somehow, magically, the user that has a valid session was not found in the database.'
			});
		}

		return user;
	})
});

export default router;
