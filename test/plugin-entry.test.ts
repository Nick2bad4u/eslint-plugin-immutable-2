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
            "no-class",
            "no-conditional-statement",
            "no-expression-statement",
            "no-let",
            "no-loop-statement",
            "no-method-signature",
            "no-mixed-interface",
            "no-reject",
            "no-this",
            "no-throw",
            "no-try",
            "readonly-array",
            "readonly-keyword",
        ]);
    });
});
