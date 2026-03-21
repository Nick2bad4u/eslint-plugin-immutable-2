import tsParser from "@typescript-eslint/parser";
import * as path from "node:path";

import plugin from "../plugin.mjs";

/**
 * @typedef {Record<string, unknown>} UnknownRecord
 */

/**
 * @typedef {import("eslint").Linter.RulesRecord} BenchmarkRules
 */

/**
 * @typedef {{
 *     arrayableStressFixture: readonly string[];
 *     recommendedZeroMessageFixture: readonly string[];
 *     isPresentStressFixture: readonly string[];
 *     setHasStressFixture: readonly string[];
 *     safeCastToStressFixture: readonly string[];
 *     stringSplitStressFixture: readonly string[];
 *     typedInvalidFixtures: readonly string[];
 *     typedValidFixtures: readonly string[];
 * }} BenchmarkFileGlobs
 */

/**
 * @typedef {{ rules: BenchmarkRules }} CreateImmutableFlatConfigOptions
 */

/**
 * Check whether a value is an object record.
 *
 * @param {unknown} value - Value to inspect.
 *
 * @returns {value is UnknownRecord} `true` when value is a non-null object.
 */
const isUnknownRecord = (value) => typeof value === "object" && value !== null;

/**
 * Absolute repository root used by parser services and benchmark paths.
 */
export const repositoryRoot = path.resolve(process.cwd());

/**
 * Shared file globs used by benchmark scenarios.
 */
/** @type {Readonly<BenchmarkFileGlobs>} */
export const benchmarkFileGlobs = Object.freeze({
    arrayableStressFixture: Object.freeze([
        "benchmarks/fixtures/arrayable.stress.ts",
    ]),
    isPresentStressFixture: Object.freeze([
        "benchmarks/fixtures/is-present.stress.ts",
    ]),
    recommendedZeroMessageFixture: Object.freeze([
        "benchmarks/fixtures/recommended-zero-message.baseline.ts",
    ]),
    safeCastToStressFixture: Object.freeze([
        "benchmarks/fixtures/safe-cast-to.stress.ts",
    ]),
    setHasStressFixture: Object.freeze([
        "benchmarks/fixtures/set-has.stress.ts",
    ]),
    stringSplitStressFixture: Object.freeze([
        "benchmarks/fixtures/string-split.stress.ts",
    ]),
    typedInvalidFixtures: Object.freeze(["test/fixtures/typed/*.invalid.ts"]),
    typedValidFixtures: Object.freeze(["test/fixtures/typed/*.valid.ts"]),
});

/**
 * Ensure a dynamic value is a non-null object record.
 *
 * @param {unknown} value - Value to validate.
 * @param {string} label - Error label for diagnostics.
 *
 * @returns {UnknownRecord} Normalized object record.
 */
const ensureRecord = (value, label) => {
    if (!isUnknownRecord(value)) {
        throw new TypeError(`${label} must be a non-null object.`);
    }

    return value;
};

/**
 * Check whether a value is an ESLint rule entry.
 *
 * @param {unknown} value - Rule config candidate.
 *
 * @returns {value is import("eslint").Linter.RuleEntry} Whether value matches
 *   an ESLint rule entry shape.
 */
const isRuleEntry = (value) =>
    typeof value === "number" ||
    typeof value === "string" ||
    Array.isArray(value);

/**
 * Ensure a dynamic value is a valid ESLint rules record.
 *
 * @param {unknown} value - Value to validate.
 * @param {string} label - Error label for diagnostics.
 *
 * @returns {BenchmarkRules} Normalized rules record.
 */
const ensureRulesRecord = (value, label) => {
    const record = ensureRecord(value, label);
    /** @type {BenchmarkRules} */
    const rulesRecord = {};

    for (const [ruleName, ruleEntry] of Object.entries(record)) {
        if (!isRuleEntry(ruleEntry)) {
            throw new TypeError(
                `${label}.${ruleName} must be a valid ESLint rule entry.`
            );
        }

        rulesRecord[ruleName] = ruleEntry;
    }

    return rulesRecord;
};

/**
 * Resolve rules from a plugin preset by name.
 *
 * @param {string} presetName - Key under `immutablePlugin.configs`.
 *
 * @returns {Readonly<BenchmarkRules>} Frozen rule map suitable for flat config.
 */
const resolveRuleSet = (presetName) => {
    const configs = ensureRecord(plugin.configs, "plugin.configs");
    const preset = ensureRecord(
        configs[presetName],
        `plugin.configs.${presetName}`
    );
    const rules = ensureRulesRecord(
        preset["rules"],
        `${presetName} preset rules`
    );

    return Object.freeze({ ...rules });
};

/**
 * Plugin rule sets used by benchmark scenarios.
 *
 * @type {Readonly<{
 *     all: Readonly<BenchmarkRules>;
 *     functional: Readonly<BenchmarkRules>;
 *     functionalLite: Readonly<BenchmarkRules>;
 *     immutable: Readonly<BenchmarkRules>;
 *     recommended: Readonly<BenchmarkRules>;
 * }>}
 */
export const immutableRuleSets = Object.freeze({
    all: resolveRuleSet("all"),
    functional: resolveRuleSet("functional"),
    functionalLite: resolveRuleSet("functional-lite"),
    immutable: resolveRuleSet("immutable"),
    recommended: resolveRuleSet("recommended"),
});

/**
 * Create a flat ESLint config array for immutable benchmark scenarios.
 *
 * @param {CreateImmutableFlatConfigOptions} options - Config creation options.
 *
 * @returns {import("eslint").Linter.Config[]} Flat config array for ESLint Node
 *   API / CLI usage.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- This .mjs module relies on JSDoc contracts instead of TS syntax.
export function createImmutableFlatConfig(options) {
    const { rules } = options;

    return [
        {
            files: ["**/*.{ts,tsx,mts,cts}"],
            languageOptions: {
                parser: tsParser,
                parserOptions: {
                    ecmaVersion: "latest",
                    project: "./tsconfig.eslint.json",
                    sourceType: "module",
                    tsconfigRootDir: repositoryRoot,
                },
            },
            name: "benchmark:immutable",
            plugins: {
                immutable: plugin,
            },
            rules,
        },
    ];
}
