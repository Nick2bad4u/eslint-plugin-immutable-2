import type { Linter } from "eslint";

/** Flat config `all` preset rules for the immutable plugin. */
const allConfigRules = {
    "immutable/immutable-data": "error",
    "immutable/no-atomics-mutation": "error",
    "immutable/no-buffer-mutation": "error",
    "immutable/no-class": "error",
    "immutable/no-conditional-statement": "error",
    "immutable/no-data-view-mutation": "error",
    "immutable/no-date-mutation": "error",
    "immutable/no-expression-statement": "error",
    "immutable/no-form-data-mutation": "error",
    "immutable/no-headers-mutation": "error",
    "immutable/no-history-mutation": "error",
    "immutable/no-let": "error",
    "immutable/no-location-mutation": "error",
    "immutable/no-loop-statement": "error",
    "immutable/no-map-set-mutation": "error",
    "immutable/no-method-signature": "error",
    "immutable/no-mixed-interface": "error",
    "immutable/no-process-env-mutation": "error",
    "immutable/no-regexp-lastindex-mutation": "error",
    "immutable/no-reject": "error",
    "immutable/no-reflect-mutation": "error",
    "immutable/no-stateful-regexp": "error",
    "immutable/no-storage-mutation": "error",
    "immutable/no-this": "error",
    "immutable/no-throw": "error",
    "immutable/no-try": "error",
    "immutable/no-typed-array-mutation": "error",
    "immutable/no-url-mutation": "error",
    "immutable/no-url-search-params-mutation": "error",
    "immutable/readonly-array": "error",
    "immutable/readonly-keyword": "error",
} as const satisfies NonNullable<Linter.Config["rules"]>;

/** Flat config `all` preset. */
const allConfig: Linter.Config = {
    rules: allConfigRules,
};

export default allConfig;
