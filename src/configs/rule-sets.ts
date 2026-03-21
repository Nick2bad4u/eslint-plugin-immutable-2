import type { Linter } from "eslint";

type ConfigRules = NonNullable<Linter.Config["rules"]>;

/** Baseline immutable rules shared by `immutable` and `recommended`. */
export const immutableConfigRules: ConfigRules = {
    "immutable/immutable-data": "error",
    "immutable/no-abort-controller-mutation": "error",
    "immutable/no-atomics-mutation": "error",
    "immutable/no-buffer-mutation": "error",
    "immutable/no-cache-api-mutation": "error",
    "immutable/no-cookie-mutation": "error",
    "immutable/no-data-view-mutation": "error",
    "immutable/no-date-mutation": "error",
    "immutable/no-dom-token-list-mutation": "error",
    "immutable/no-form-data-mutation": "error",
    "immutable/no-headers-mutation": "error",
    "immutable/no-history-mutation": "error",
    "immutable/no-let": "error",
    "immutable/no-location-mutation": "error",
    "immutable/no-map-set-mutation": "error",
    "immutable/no-method-signature": "warn",
    "immutable/no-process-env-mutation": "error",
    "immutable/no-reflect-mutation": "error",
    "immutable/no-regexp-lastindex-mutation": "error",
    "immutable/no-stateful-regexp": "error",
    "immutable/no-storage-mutation": "error",
    "immutable/no-typed-array-mutation": "error",
    "immutable/no-url-mutation": "error",
    "immutable/no-url-search-params-mutation": "error",
    "immutable/readonly-array": "error",
    "immutable/readonly-keyword": "error",
};

/** Additional low-churn functional rules layered onto the immutable baseline. */
export const functionalLiteOnlyRules: ConfigRules = {
    "immutable/no-conditional-statement": [
        "error",
        { allowReturningBranches: true },
    ],
    "immutable/no-loop-statement": "error",
    "immutable/no-mixed-interface": "error",
};

/** Flat config `functional-lite` preset rules. */
export const functionalLiteConfigRules: ConfigRules = {
    ...immutableConfigRules,
    ...functionalLiteOnlyRules,
};

/** Additional strict functional rules layered onto `functional-lite`. */
export const functionalOnlyRules: ConfigRules = {
    "immutable/no-class": "error",
    "immutable/no-conditional-statement": "error",
    "immutable/no-expression-statement": "error",
    "immutable/no-this": "error",
    "immutable/no-throw": "error",
    "immutable/no-try": "error",
};

/** Flat config `functional` preset rules. */
export const functionalConfigRules: ConfigRules = {
    ...functionalLiteConfigRules,
    ...functionalOnlyRules,
};

/** Additional `all`-only rules and overrides layered onto `functional`. */
export const allOnlyRules: ConfigRules = {
    "immutable/no-method-signature": "error",
    "immutable/no-reject": "error",
};

/** Flat config `all` preset rules for the immutable plugin. */
export const allConfigRules: ConfigRules = {
    ...functionalConfigRules,
    ...allOnlyRules,
};
