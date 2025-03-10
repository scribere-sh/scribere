import { t } from '$trpc';

import profile from './profile';
import settings from './settings';

const router = t.router({
	profile,
	settings
});

export default router;
