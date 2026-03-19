import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-let rule", () => {
    it("exports no-let rule module", () => {
        expect(getPluginRule("no-let")).toBeDefined();
    });

    tester.run("no-let", getPluginRule("no-let"), {
        invalid: [
            {
                code: "let count = 0;",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestConst",
                                output: "const count = 0;",
                            },
                        ],
                    },
                ],
            },
            {
                code: "for (let index = 0; index < 3; index += 1) {}",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const count = 0;",
            {
                code: "let mutableCount = 0;",
                options: [{ ignorePattern: "^mutable" }],
            },
        ],
    });
});
