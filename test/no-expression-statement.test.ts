import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-expression-statement rule", () => {
    it("exports no-expression-statement rule module", () => {
        expect(getPluginRule("no-expression-statement")).toBeDefined();
    });

    tester.run(
        "no-expression-statement",
        getPluginRule("no-expression-statement"),
        {
            invalid: [
                {
                    code: "doSideEffect();",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "console.trace('debug');",
                    errors: [{ messageId: "generic" }],
                    options: [{ ignorePattern: String.raw`^console\.log` }],
                },
            ],
            valid: [
                "const value = transform(input);",
                {
                    code: "console.log('allowed');",
                    options: [{ ignorePattern: String.raw`^console\.` }],
                },
            ],
        }
    );
});
