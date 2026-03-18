import {
    createImmutableFlatConfig,
    immutableRuleSets,
} from "./eslint-benchmark-config.mjs";

/**
 * Benchmark-oriented ESLint flat config for CLI TIMING/--stats runs.
 */
const benchmarkTimingConfig = createImmutableFlatConfig({
    rules: immutableRuleSets.recommended,
});

export default benchmarkTimingConfig;
