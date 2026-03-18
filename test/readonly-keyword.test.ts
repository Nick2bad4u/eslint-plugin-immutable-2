import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("readonly-keyword rule", () => {
    it("exports readonly-keyword rule module", () => {
        expect(getPluginRule("readonly-keyword")).toBeDefined();
    });

    it("requires readonly modifier on fields and index signatures", () => {
        expect(getPluginRule("readonly-keyword")).toBeDefined();

        tester.run("readonly-keyword", getPluginRule("readonly-keyword"), {
            invalid: [
                {
                    code: "interface State { value: number }",
                    errors: [{ messageId: "generic" }],
                    output: "interface State { readonly value: number }",
                },
                {
                    code: "interface Dict { [key: string]: number }",
                    errors: [{ messageId: "generic" }],
                    output: "interface Dict { readonly [key: string]: number }",
                },
            ],
            valid: [
                "interface State { readonly value: number }",
                "interface Dict { readonly [key: string]: number }",
            ],
        });
    });
});
