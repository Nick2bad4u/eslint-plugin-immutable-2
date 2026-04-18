import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-this rule", () => {
    it("exports no-this rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-this")).toBeDefined();
    });

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
