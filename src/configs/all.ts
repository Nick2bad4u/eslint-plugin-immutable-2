import type { Linter } from "eslint";

import { allConfigRules } from "./rule-sets.js";

/** Flat config `all` preset. */
const allConfig: Linter.Config = {
    rules: allConfigRules,
};

export default allConfig;
