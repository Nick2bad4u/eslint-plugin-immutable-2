import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-throw rule", () => {
    it("exports no-throw rule module", () => {
        expect(getPluginRule("no-throw")).toBeDefined();
    });

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
