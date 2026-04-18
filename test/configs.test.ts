import { describe, expect, it } from "vitest";

import immutablePlugin from "../src/plugin";

describe("immutable plugin configs", () => {
    it("exports supported config keys", () => {
        expect.hasAssertions();
        expect(
            Object.keys(immutablePlugin.configs).toSorted((left, right) =>
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
        expect.hasAssertions();

        for (const config of Object.values(immutablePlugin.configs)) {
            expect(config.plugins).toHaveProperty("immutable");
            expect(config.languageOptions).toBeDefined();
            expect(config.languageOptions?.["parser"]).toBeDefined();
            expect(config.languageOptions?.["parserOptions"]).toStrictEqual(
                expect.objectContaining({
                    ecmaVersion: "latest",
                    sourceType: "module",
                })
            );
        }
    });

    it("enables all immutable rules in the all preset", () => {
        expect.hasAssertions();

        const ruleIds = Object.keys(immutablePlugin.rules).map(
            (ruleName) => `immutable/${ruleName}`
        );

        expect(immutablePlugin.configs.all.rules).toStrictEqual(
            expect.objectContaining(
                Object.fromEntries(ruleIds.map((ruleId) => [ruleId, "error"]))
            )
        );
    });
});
