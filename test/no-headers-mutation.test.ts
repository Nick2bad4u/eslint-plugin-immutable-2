import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-headers-mutation rule", () => {
    it("exports no-headers-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-headers-mutation")).toBeDefined();
    });

    tester.run("no-headers-mutation", getPluginRule("no-headers-mutation"), {
        invalid: [
            {
                code: "const headers = new Headers(); headers.set('x-trace-id', 'a1');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const headers = new Headers(); headers.append('x-role', 'admin');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const headers = new Headers([['x', '1']]); headers.delete('x');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const source = new Headers(); const alias = source; alias.set('cache-control', 'no-store');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "new Headers().set('accept', 'application/json');",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression
            {
                code: "const headers = new Headers(); (headers satisfies Headers).set('x-trace-id', 'a1');",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion
            {
                code: "const headers = new Headers(); (<Headers>headers).set('x-trace-id', 'a1');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression
            {
                code: "const headers = new Headers(); headers!.set('x-trace-id', 'a1');",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const headers = new Headers(); headers.get('x-request-id');",
            "const headers = new Headers(); headers.has('x-request-id');",
            "const custom = { set() {} }; custom.set();",
            {
                code: "const headers = new Headers(); headers.set('x-request-id', 'abc');",
                options: [{ ignoreAccessorPattern: "headers" }],
            },
            {
                code: "const headers = new Headers(); headers.set('x-request-id', 'abc');",
                options: [{ ignorePattern: "^headers$" }],
            },
            "let headers = new Headers(); headers = getReplacement(); headers.set('x-request-id', 'abc'); function getReplacement() { return new Map(); }",
        ],
    });
});
