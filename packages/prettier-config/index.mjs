/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type { import('prettier').Config }
 */
const config = {
    useTabs: false,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: "none",
    printWidth: 100,
    semi: true,
    embeddedLanguageFormatting: "auto",
    htmlWhitespaceSensitivity: "strict",
    plugins: [
        "prettier-plugin-svelte",
        "@trivago/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
    ],

    // tailwind
    tailwindFunctions: ["cn", "tv"],

    // import sorter
    importOrder: [
        // types
        "^.*\\$types$",
        // take a wild guess
        "<THIRD_PARTY_MODULES>",
        // @scribere/ui imports
        "^@scribere\\/ui\\/.*$",
        // @scribere other
        "^@scribere\\/(.*)$",
        // $auth, because it's big
        "^\\$auth(?:\\/.*)?",
        // $ imports
        "^\\$.*$",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,
    importOrderCaseInsensitive: true,

    // overrides
    overrides: [
        {
            files: ["*.svelte"],
            excludeFiles: [".svelte-kit/*"],
            options: {
                parser: "svelte",
            },
        },
    ],
};

export default config;
