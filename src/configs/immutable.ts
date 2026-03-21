import type { Linter } from "eslint";

import { immutableConfigRules } from "./rule-sets.js";

/** Flat config `immutable` preset. */
const immutableConfig: Linter.Config = {
    rules: immutableConfigRules,
};

export default immutableConfig;
