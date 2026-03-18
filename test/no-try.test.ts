import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-try rule", () => {
    it("exports no-try rule module", () => {
        expect(getPluginRule("no-try")).toBeDefined();
    });

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
