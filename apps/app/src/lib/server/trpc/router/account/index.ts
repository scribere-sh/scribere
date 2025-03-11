import profile from './profile';
import settings from './settings';

import { t } from '$trpc';

const router = t.router({
    profile,
    settings
});

export default router;
