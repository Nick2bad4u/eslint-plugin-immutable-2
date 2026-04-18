import {
    createImmutableFlatConfig,
    immutableRuleSets,
} from "./eslint-benchmark-config.mjs";

/**
 * Benchmark-oriented ESLint flat config for CLI TIMING/--stats runs.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const benchmarkTimingConfig = createImmutableFlatConfig({
    rules: immutableRuleSets.recommended,
});

export default benchmarkTimingConfig;
