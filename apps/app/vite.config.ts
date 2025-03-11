import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { defineConfig } from 'vitest/config';

import type { KIT_ROUTES } from '$routes';

export default defineConfig({
    plugins: [
        sveltekit(),
        kitRoutes<KIT_ROUTES>({
            exportObjects: true,
            post_update_run: 'prettier ./src/lib/ROUTES.ts -w',
        }),
    ],
    resolve: {
        alias: {
            $auth: resolve('./src/lib/server/auth'),
            $db: resolve('./src/lib/server/db'),
            $oauth: resolve('./src/lib/server/oauth'),
            $trpc: resolve('./src/lib/server/trpc'),
            '$trpc-client': resolve('./src/lib/client/trpc.ts'),
            $forms: resolve('./src/lib/client/forms.ts'),
            $routes: resolve('./src/lib/ROUTES.ts'),
            $util: resolve('./src/lib/server/util.ts'),
        },
    },
    test: {
        outputFile: '../../reports/vitest-scribere.xml',
        include: ['./test/**/*.test.ts'],
    },
});
