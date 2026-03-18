import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-this rule", () => {
    tester.run("no-this", getPluginRule("no-this"), {
        invalid: [
            {
                code: "this.value = 1;",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: ["const value = 1;"],
    });
});
