import { describe } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-method-signature rule", () => {
    tester.run("no-method-signature", getPluginRule("no-method-signature"), {
        invalid: [
            {
                code: "interface Service { run(input: string): string; }",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "type Service = { run(input: string): string };",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "interface Service { readonly run: (input: string) => string; }",
            "type Service = { readonly run: (input: string) => string };",
        ],
    });
});
