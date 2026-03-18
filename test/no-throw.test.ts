import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-throw rule", () => {
    tester.run("no-throw", getPluginRule("no-throw"), {
        invalid: [
            {
                code: "throw new Error('boom');",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: ["const error = new Error('boom');"],
    });
});
