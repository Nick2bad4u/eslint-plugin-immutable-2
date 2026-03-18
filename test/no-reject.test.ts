import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-reject rule", () => {
    tester.run("no-reject", getPluginRule("no-reject"), {
        invalid: [
            {
                code: "const result = Promise.reject(new Error('boom'));",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const result = Promise.resolve(new Error('boom'));",
            "const reject = Promise.reject; reject(new Error('boom'));",
        ],
    });
});
