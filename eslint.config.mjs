import nickTwoBadFourU from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.withoutImmutable2,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Immutable",
        plugins: {
            immutable: plugin,
        },
        rules: {
            // Only turn on for testing rules in this repository, not for the entire plugin
            // ...immutable.configs.all.rules,
        },
    },
    {
        files: ["src/plugin.ts"],
        name: "Plugin Entrypoint Interop",
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "import-x/extensions": "off",
        },
    },
    {
        files: ["test/docs-heading-snapshots.test.ts"],
        name: "Docs Heading Snapshot Order",
        rules: {
            "perfectionist/sort-arrays": "off",
        },
    },
    {
        files: [
            "benchmarks/**/*.mjs",
            "commitlint.config.mjs",
            "docs/docusaurus/typedoc-plugins/**/*.mjs",
            "scripts/**/*.mjs",
        ],
        name: "Tooling Script Rule Scopes",
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-misused-spread": "off",
            "jsdoc/check-tag-names": "off",
            "jsdoc/informative-docs": "off",
            "jsdoc/match-description": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/reject-any-type": "off",
            "jsdoc/require-returns-type": "off",
            "jsdoc/require-template-description": "off",
            "jsdoc/require-throws": "off",
            "jsdoc/text-escaping": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
