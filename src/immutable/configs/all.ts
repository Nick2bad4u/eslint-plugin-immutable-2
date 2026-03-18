import type { Linter } from "eslint";

/** Flat config `all` preset rules for the immutable plugin. */
const allConfigRules = {
    "immutable/immutable-data": "error",
    "immutable/no-class": "error",
    "immutable/no-conditional-statement": "error",
    "immutable/no-expression-statement": "error",
    "immutable/no-let": "error",
    "immutable/no-loop-statement": "error",
    "immutable/no-method-signature": "error",
    "immutable/no-mixed-interface": "error",
    "immutable/no-reject": "error",
    "immutable/no-this": "error",
    "immutable/no-throw": "error",
    "immutable/no-try": "error",
    "immutable/readonly-array": "error",
    "immutable/readonly-keyword": "error",
} as const satisfies NonNullable<Linter.Config["rules"]>;

/** Flat config `all` preset. */
const allConfig: Linter.Config = {
    rules: allConfigRules,
};

export default allConfig;
