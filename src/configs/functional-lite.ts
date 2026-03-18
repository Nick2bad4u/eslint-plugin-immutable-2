import type { Linter } from "eslint";

/** Flat config `functional-lite` preset rules. */
const functionalLiteConfigRules = {
    "immutable/immutable-data": "error",
    "immutable/no-class": "error",
    "immutable/no-conditional-statement": ["error", { allowReturningBranches: true }],
    "immutable/no-let": "error",
    "immutable/no-loop-statement": "error",
    "immutable/no-method-signature": "warn",
    "immutable/no-mixed-interface": "error",
    "immutable/no-this": "error",
    "immutable/no-throw": "error",
    "immutable/readonly-array": "error",
    "immutable/readonly-keyword": "error",
} as const satisfies NonNullable<Linter.Config["rules"]>;

/** Flat config `functional-lite` preset. */
const functionalLiteConfig: Linter.Config = {
    rules: functionalLiteConfigRules,
};

export default functionalLiteConfig;
