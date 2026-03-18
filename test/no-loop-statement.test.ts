import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-loop-statement rule", () => {
    it("exports no-loop-statement rule module", () => {
        expect(getPluginRule("no-loop-statement")).toBeDefined();
    });

    tester.run("no-loop-statement", getPluginRule("no-loop-statement"), {
        invalid: [
            {
                code: "for (const value of values) { consume(value); }",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "while (ready) { tick(); }",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "values.forEach((value) => consume(value));",
            "const total = values.reduce((sum, value) => sum + value, 0);",
        ],
    });
});
