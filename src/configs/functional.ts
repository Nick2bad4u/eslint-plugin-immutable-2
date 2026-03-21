import type { Linter } from "eslint";

import { functionalConfigRules } from "./rule-sets.js";

/** Flat config `functional` preset. */
const functionalConfig: Linter.Config = {
    rules: functionalConfigRules,
};

export default functionalConfig;
