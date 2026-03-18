import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-try rule", () => {
    tester.run("no-try", getPluginRule("no-try"), {
        invalid: [
            {
                code: "try { risky(); } catch (error) { recover(error); }",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: ["const result = safeComputation();"],
    });
});
