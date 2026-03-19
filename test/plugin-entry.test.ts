import { describe, expect, it } from "vitest";

import immutablePlugin from "../src/plugin";

describe("plugin entry module", () => {
    it("exports default plugin object with rule and config registries", () => {
        expect(immutablePlugin).toHaveProperty("rules");
        expect(immutablePlugin).toHaveProperty("configs");
        expect(immutablePlugin).toHaveProperty("meta");
    });

    it("uses immutable identity metadata", () => {
        expect(immutablePlugin.meta).toMatchObject({
            name: "eslint-plugin-immutable",
            namespace: "immutable",
        });
        expect(typeof immutablePlugin.meta.version).toBe("string");
    });

    it("contains all migrated immutable rules", () => {
        expect(
            Object.keys(immutablePlugin.rules).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toStrictEqual([
            "immutable-data",
            "no-atomics-mutation",
            "no-buffer-mutation",
            "no-class",
            "no-conditional-statement",
            "no-data-view-mutation",
            "no-date-mutation",
            "no-expression-statement",
            "no-form-data-mutation",
            "no-headers-mutation",
            "no-history-mutation",
            "no-let",
            "no-location-mutation",
            "no-loop-statement",
            "no-map-set-mutation",
            "no-method-signature",
            "no-mixed-interface",
            "no-process-env-mutation",
            "no-reflect-mutation",
            "no-regexp-lastindex-mutation",
            "no-reject",
            "no-stateful-regexp",
            "no-storage-mutation",
            "no-this",
            "no-throw",
            "no-try",
            "no-typed-array-mutation",
            "no-url-mutation",
            "no-url-search-params-mutation",
            "readonly-array",
            "readonly-keyword",
        ]);
    });
});
