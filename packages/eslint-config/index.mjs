import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import turbo from "eslint-config-turbo/flat"

export const config = ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs['flat/recommended'],
    prettier,
    ...svelte.configs['flat/prettier'],
    ...turbo,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ['**/*.svelte'],
        ignores: [".svelte-kit/**/*"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "warn"
        }
    },
    {
        ignores: [
            "**/.svelte-kit/**/*",
            "**/dist/**/*",
            "**/build/**/*"
        ]
    }
);
