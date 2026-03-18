import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-let rule", () => {
    tester.run("no-let", getPluginRule("no-let"), {
        invalid: [
            {
                code: "let count = 0;",
                errors: [{ messageId: "generic" }],
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
