import type { KIT_ROUTES } from './src/lib/ROUTES';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        sveltekit(),
        kitRoutes<KIT_ROUTES>({
            exportObjects: true,
            post_update_run: 'prettier ./src/lib/ROUTES.ts -w'
        })
    ],
    server: {
        port: 5169
    }
});
