import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	compilerOptions: {
		modernAst: true
	},

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			platformProxy: {
				configPath: './wrangler.jsonc'
			}
		}),

		alias: {
			$auth: 'src/lib/server/auth',
			$db: 'src/lib/server/db',
			$oauth: 'src/lib/server/oauth',
			$trpc: 'src/lib/server/trpc',
            '$trpc-client': 'src/lib/client/trpc.ts',
            $forms: 'src/lib/client/forms.ts',
            $routes: 'src/lib/ROUTES.ts',
            $util: 'src/lib/server/util.ts'
		}
	}
};

export default config;
