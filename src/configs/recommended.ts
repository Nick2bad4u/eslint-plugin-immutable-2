import type { Linter } from "eslint";

import { recommendedConfigRules } from "./rule-sets.js";

/** Flat config `recommended` preset. */
const recommendedConfig: Linter.Config = {
    rules: recommendedConfigRules,
};

export default recommendedConfig;
