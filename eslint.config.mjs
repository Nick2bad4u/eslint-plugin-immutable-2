import { createConfig } from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...createConfig({
        allowDefaultProjectFilePatterns: [
            ".remarkrc.mjs",
            "commitlint.config.mjs",
            "eslint.config.mjs",
            "knip.config.ts",
            "prettier.config.mjs",
            "stylelint.config.mjs",
            "vitest.stryker.config.ts",
        ],
        plugins: {
            immutable: false,
            "immutable-2": false,
        },
    }),

    {
        ignores: [
            "benchmark/**",
            "benchmarks/**",
            "docs/docusaurus/typedoc-plugins/**",
            "plugin.d.mts",
            "plugin.mjs",
            "stryker.config.mjs",
        ],
    },

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
    {
        files: ["docs/docusaurus/docusaurus.config.ts"],
        name: "Docusaurus Config Runtime Environment",
        rules: {
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "n/no-process-env": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-temporal": "off",
        },
    },
    {
        files: ["docs/docusaurus/src/**/*.{ts,tsx}"],
        name: "Docusaurus Browser Runtime Code",
        rules: {
            "@typescript-eslint/no-dynamic-delete": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "prefer-named-capture-group": "off",
            "regexp/no-super-linear-backtracking": "off",
            "regexp/prefer-named-capture-group": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "runtime-cleanup/no-unmanaged-event-listeners": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/no-global-object-property-assignment": "off",
            "unicorn/no-immediate-mutation": "off",
            "unicorn/no-incorrect-template-string-interpolation": "off",
            "unicorn/no-unnecessary-global-this": "off",
            "unicorn/prefer-global-this": "off",
            // Scroll progress requires continuous layout-derived updates rather than visibility changes.
            "unicorn/prefer-observer-apis": "off",
        },
    },
    {
        files: ["docs/docusaurus/src/**/*.css"],
        name: "Docusaurus CSS Shared Stylelint Boundaries",
        rules: {
            "stylelint-2/stylelint": "off",
        },
    },
    {
        files: ["docs/docusaurus/src/pages/index.tsx"],
        name: "Docusaurus Pages Entrypoint",
        rules: {
            "canonical/filename-no-index": "off",
        },
    },
    {
        files: ["src/**/*.{ts,mts,cts}", "test/**/*.{ts,mts,cts}"],
        name: "TypeScript Source Import Conventions",
        rules: {
            "no-duplicate-imports": "off",
            "unicorn/consistent-boolean-name": "off",
        },
    },
    {
        files: ["src/rules/rule-registry.ts"],
        name: "Rule Registry Imports",
        rules: {
            "import-x/max-dependencies": "off",
        },
    },
    {
        files: ["test/**/*.test.ts"],
        name: "RuleTester Suite Assertions",
        rules: {
            "n/no-process-env": "off",
            "test-signal/no-weak-existence-assertions": "off",
            "test-signal/require-negative-path": "off",
            "unicorn/max-nested-calls": "off",
            // Tests parse arbitrary thrown values and retain compatibility with supported Node versions.
            "unicorn/prefer-error-is-error": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
