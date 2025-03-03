/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type { import('prettier').Config }
 */
const config = {
    useTabs: true,
    singleQuote: true,
    trailingComma: "none",
    printWidth: 100,
    plugins: [ "prettier-plugin-svelte", "prettier-plugin-organize-imports", "prettier-plugin-tailwindcss" ],
    tailwindFunctions: ["cn"],
    overrides: [
        {
            files: ["*.svelte"],
            excludeFiles: [".svelte-kit/*"],
            options: {
                parser: "svelte"
            }
        }
    ]
};

export default config;
