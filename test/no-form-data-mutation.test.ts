import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-form-data-mutation rule", () => {
    it("exports no-form-data-mutation rule module", () => {
        expect(getPluginRule("no-form-data-mutation")).toBeDefined();
    });

    tester.run(
        "no-form-data-mutation",
        getPluginRule("no-form-data-mutation"),
        {
            invalid: [
                {
                    code: "const formData = new FormData(); formData.set('name', 'nick');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const formData = new FormData(); formData.append('avatar', new Blob());",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const formData = new FormData(); formData.delete('avatar');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const payload = new FormData(); const alias = payload; alias.append('id', '42');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "new FormData().set('token', 'abc');",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression
                {
                    code: "const payload = new FormData(); payload!.set('token', 'abc');",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const formData = new FormData(); formData.get('name');",
                "const formData = new FormData(); formData.has('avatar');",
                "const custom = { append() {} }; custom.append();",
                {
                    code: "const formData = new FormData(); formData.set('name', 'nick');",
                    options: [{ ignoreAccessorPattern: "formData" }],
                },
                {
                    code: "const formData = new FormData(); formData.set('name', 'nick');",
                    options: [{ ignorePattern: "^formData$" }],
                },
                "let formData = new FormData(); formData = getReplacement(); formData.set('name', 'nick'); function getReplacement() { return new URLSearchParams(); }",
            ],
        }
    );
});
