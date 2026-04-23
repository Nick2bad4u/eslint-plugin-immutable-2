/**
 * Repository-specific configuration for Knip dependency analysis.
 *
 * @packageDocumentation
 */
import type { KnipConfig } from "knip";

/**
 * Knip configuration that scopes entry points and dependency heuristics to the
 * repository layout.
 */
const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip@5/schema.json",
    entry: [],
    ignore: [
        "docs/docusaurus/src/css/custom.css.d.ts",
        // Docusaurus theme swizzle override — loaded at build time by Docusaurus, not statically imported
        "docs/docusaurus/src/theme/prism-include-languages.js",
        // Generated TypeDoc Docusaurus sidebar — consumed by Docusaurus at build time
        "docs/docusaurus/site-docs/developer/api/typedoc-sidebar.cjs",
        "docs/docusaurus/typedoc-plugins/hashToBangLinks.mjs",
        "docs/docusaurus/typedoc-plugins/hashToBangLinksCore.d.mts",
        "docs/docusaurus/typedoc-plugins/hashToBangLinksCore.mjs",
        "docs/docusaurus/typedoc-plugins/prefixDocLinks.mjs",
        "docs/docusaurus/typedoc-plugins/prefixDocLinksCore.d.mts",
        "docs/docusaurus/typedoc-plugins/prefixDocLinksCore.mjs",
    ],
    ignoreBinaries: [
        "git-cz",
        "grype",
        "open-cli",
        // False-positve Knip thinks knip.config.ts is a binary entry point, but it's actually just a config file.
        "knip.config.ts",
        // Esbuild is used internally by Vite/Vitest, not directly referenced in source
        "esbuild",
    ],
    ignoreDependencies: [
        ".*prettier.*",
        // @docusaurus/faster is now detected as used (Docusaurus faster config); no longer needs manual ignore
        // "@docusaurus/faster",
        "@easyops-cn/docusaurus-search-local",
        "@easyops-cn/docusaurus-theme-docusaurus-search-local",
        "@eslint.*",
        "@microsoft/tsdoc-config",
        "@secretlint/secretlint-rule-anthropic",
        "@secretlint/secretlint-rule-aws",
        "@secretlint/secretlint-rule-database-connection-string",
        "@secretlint/secretlint-rule-gcp",
        "@secretlint/secretlint-rule-github",
        "@secretlint/secretlint-rule-no-dotenv",
        "@secretlint/secretlint-rule-no-homedir",
        "@secretlint/secretlint-rule-npm",
        "@secretlint/secretlint-rule-openai",
        "@secretlint/secretlint-rule-pattern",
        "@secretlint/secretlint-rule-preset-recommend",
        "@secretlint/secretlint-rule-privatekey",
        "@secretlint/secretlint-rule-secp256k1-privatekey",
        "@stylelint.*",
        "@types.*",
        "eslint.*",
        // Madge is now detected as used; no longer needs manual ignore
        // "madge",
        "postcss.*",
        "remark.*",
        "stylelint.*",
        "ts.*",
        "type.*",
        "unified",

        // Items flagged by knip report (ignored to suppress false-positives / repo-local tools)
        "clsx",
        "react-github-btn",
        "actionlint",
        "commitlint",
        "gitleaks-secret-scanner",
        "htmlhint",
        "leasot",
        "markdown-link-check",
        "sloc",
        // Storybook is now detected as used; no longer needs manual ignore
        // "storybook",
        "yamllint-js",
        "react",
        // Stryker mutation testing framework — uses dynamic plugin loading, not statically analysable
        "@stryker-ignorer/console-all",
        "@stryker-ignorer/.*",
        "@stryker-mutator/.*",
        // Property-based testing library — used in typed test fixtures but not in knip project scope
        "fast-check",
        // Commit message linting — loaded by commitlint at runtime, not statically imported
        "commitlint-config-gitmoji",
    ],
    ignoreExportsUsedInFile: {
        interface: true,
        type: true,
    },
    includeEntryExports: true,
    project: [],
    rules: {
        binaries: "error",
        catalog: "error",
        dependencies: "error",
        devDependencies: "error",
        duplicates: "error",
        enumMembers: "warn",
        exports: "warn",
        files: "error",
        namespaceMembers: "warn",
        nsExports: "warn",
        nsTypes: "warn",
        optionalPeerDependencies: "error",
        types: "warn",
        unlisted: "error",
        unresolved: "error",
    },
    workspaces: {
        ".": {
            entry: [],
            project: [],
        },
        src: {
            entry: ["src/plugin.ts"],
            project: [
                "!src/**/*.spec.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
                "!src/**/*.test.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
                "src/**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
            ],
        },
    },
};

export default knipConfig;
