import nick2bad4u from "eslint-config-nick2bad4u";

import immutable from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutImmutable2,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Immutable",
        plugins: {
            immutable: immutable,
        },
        rules: {
            // Only turn on for testing rules in this repository, not for the entire plugin
            // ...immutable.configs.all.rules,
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
