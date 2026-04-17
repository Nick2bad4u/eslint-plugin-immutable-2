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
            // let with reassignment (canSafelySuggestConst returns false)
            {
                code: "let count = 0; count = 1;",
                errors: [
                    {
                        messageId: "generic",
                    },
                ],
            },
            // let in for-of loop
            {
                code: "for (let item of [1, 2, 3]) {}",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestConst",
                                output: "for (const item of [1, 2, 3]) {}",
                            },
                        ],
                    },
                ],
            },
            // let with no initializer (declaredVariables.length === 0 check for empty destructure)
            {
                code: "let {} = obj;",
                errors: [
                    {
                        messageId: "generic",
                    },
                ],
            },
            // let with destructuring no initializer value
            {
                code: "let [] = arr;",
                errors: [
                    {
                        messageId: "generic",
                    },
                ],
            },
            // for-in loop with let
            {
                code: "for (let key in obj) {}",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestConst",
                                output: "for (const key in obj) {}",
                            },
                        ],
                    },
                ],
            },
        ],
        valid: [
            "const count = 0;",
            {
                code: "let mutableCount = 0;",
                options: [{ ignorePattern: "^mutable" }],
            },
            // var is not affected
            "var count = 0;",
            // const is already fine
            "const items = [];",
        ],
    });
});
