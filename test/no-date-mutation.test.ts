import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-date-mutation rule", () => {
    it("exports no-date-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-date-mutation")).toBeDefined();
    });

    tester.run("no-date-mutation", getPluginRule("no-date-mutation"), {
        invalid: [
            {
                code: "const start = new Date(); start.setFullYear(2026);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "let cursor = new Date(); cursor = new Date(0); cursor.setTime(100);",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const source = new Date(); const alias = source; alias.setUTCMonth(0);",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression
            {
                code: "const start = new Date(); (start satisfies Date).setFullYear(2026);",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion
            {
                code: "const start = new Date(); (<Date>start).setFullYear(2026);",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression
            {
                code: "const start = new Date(); start!.setFullYear(2026);",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const start = new Date(); start.getTime();",
            "const custom = { setMonth() {} }; custom.setMonth();",
            "const now = Date.now();",
            {
                code: "const mutableDate = new Date(); mutableDate.setMonth(1);",
                options: [{ ignorePattern: "^mutable" }],
            },
            // Undeclared variable - not tracked
            "undeclaredDate.setFullYear(2020);",
        ],
    });
});
