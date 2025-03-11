import { t } from '$trpc';
import { authMiddleware } from '$trpc/middleware';

const router = t.router({
    loadCurrentUserSettings: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userId = ctx.user.id;
    }),
});

export default router;
