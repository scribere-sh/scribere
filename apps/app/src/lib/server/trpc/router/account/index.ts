import { t } from '$lib/server/trpc';

import profile from './profile';

const router = t.router({
	profile
});

export default router;
