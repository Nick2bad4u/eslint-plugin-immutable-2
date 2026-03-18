import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

describe("plugin entry module", () => {
    it("exports default plugin object with rule and config registries", () => {
        expect(plugin).toHaveProperty("rules");
        expect(plugin).toHaveProperty("configs");
        expect(plugin).toHaveProperty("meta");
    });

    it("uses immutable identity metadata", () => {
        expect(plugin.meta).toMatchObject({
            name: "eslint-plugin-immutable",
            namespace: "immutable",
        });
        expect(typeof plugin.meta.version).toBe("string");
    });

    it("contains all migrated immutable rules", () => {
        expect(
            Object.keys(plugin.rules).toSorted((left, right) =>
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
