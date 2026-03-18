import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-expression-statement rule", () => {
    tester.run("no-expression-statement", getPluginRule("no-expression-statement"), {
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
    });
});
