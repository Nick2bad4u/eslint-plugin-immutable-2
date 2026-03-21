import type { Linter } from "eslint";

import { functionalLiteConfigRules } from "./rule-sets.js";

/** Flat config `functional-lite` preset. */
const functionalLiteConfig: Linter.Config = {
    rules: functionalLiteConfigRules,
};

export default functionalLiteConfig;
