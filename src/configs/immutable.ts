import type { Linter } from "eslint";

/** Flat config `immutable` preset rules. */
const immutableConfigRules = {
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
} as const satisfies NonNullable<Linter.Config["rules"]>;

/** Flat config `immutable` preset. */
const immutableConfig: Linter.Config = {
    rules: immutableConfigRules,
};

export default immutableConfig;
