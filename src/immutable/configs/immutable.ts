import type { Linter } from "eslint";

/** Flat config `immutable` preset rules. */
const immutableConfigRules = {
    "immutable/immutable-data": "error",
    "immutable/no-let": "error",
    "immutable/no-method-signature": "warn",
    "immutable/readonly-array": "error",
    "immutable/readonly-keyword": "error",
} as const satisfies NonNullable<Linter.Config["rules"]>;

/** Flat config `immutable` preset. */
const immutableConfig: Linter.Config = {
    rules: immutableConfigRules,
};

export default immutableConfig;
