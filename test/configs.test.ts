import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

describe("immutable plugin configs", () => {
    it("exports supported config keys", () => {
        expect(
            Object.keys(plugin.configs).toSorted((left, right) =>
                left.localeCompare(right)
            )
        ).toStrictEqual([
            "all",
            "functional",
            "functional-lite",
            "immutable",
            "recommended",
        ]);
    });

    it("registers parser defaults and plugin namespace", () => {
        for (const config of Object.values(plugin.configs)) {
            expect(config.plugins).toHaveProperty("immutable");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions?.["parser"]).toBeDefined();
            expect(config.languageOptions?.["parserOptions"]).toEqual(
                expect.objectContaining({
                    ecmaVersion: "latest",
                    sourceType: "module",
                })
            );
        }
    });

    it("enables all immutable rules in the all preset", () => {
        const ruleIds = Object.keys(plugin.rules).map(
            (ruleName) => `immutable/${ruleName}`
        );

        expect(plugin.configs.all.rules).toEqual(
            expect.objectContaining(
                Object.fromEntries(ruleIds.map((ruleId) => [ruleId, "error"]))
            )
        );
    });
});
