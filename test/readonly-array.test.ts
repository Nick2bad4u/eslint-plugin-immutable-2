import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("readonly-array rule", () => {
    it("exports readonly-array rule module", () => {
        expect(getPluginRule("readonly-array")).toBeDefined();
    });

    it("enforces readonly array annotations", () => {
        expect(getPluginRule("readonly-array")).toBeDefined();

        tester.run("readonly-array", getPluginRule("readonly-array"), {
            invalid: [
                {
                    code: "const value: string[] = [];",
                    errors: [{ messageId: "generic" }],
                    output: "const value: readonly string[] = [];",
                },
                {
                    code: "type Values = Array<string>;",
                    errors: [{ messageId: "generic" }],
                    output: "type Values = ReadonlyArray<string>;",
                },
            ],
            valid: [
                "const value: readonly string[] = [];",
                "type Values = ReadonlyArray<string>;",
            ],
        });
    });
});
