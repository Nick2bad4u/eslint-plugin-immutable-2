import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-url-mutation rule", () => {
    it("exports no-url-mutation rule module", () => {
        expect(getPluginRule("no-url-mutation")).toBeDefined();
    });

    tester.run("no-url-mutation", getPluginRule("no-url-mutation"), {
        invalid: [
            {
                code: "const url = new URL('https://example.com'); url.hash = '#v2';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const url = new URL('https://example.com'); url.search = '?q=immutable';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const url = new URL('https://example.com'); url.searchParams.set('q', '1');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const source = new URL('https://example.com'); const alias = source; alias.pathname = '/docs';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const url = new URL('https://example.com:8080'); delete url.port;",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression wrapping URL variable
            {
                code: "const url = new URL('https://example.com'); (url as URL).hash = '#v2';",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression wrapping URL variable
            {
                code: "const url = new URL('https://example.com'); url!.hash = '#v2';",
                errors: [{ messageId: "generic" }],
            },
            // URL with UpdateExpression (port++ is semantically odd but syntactically valid)
            {
                code: "const url = new URL('https://example.com:8080'); url.port++;",
                errors: [{ messageId: "generic" }],
            },
            // searchParams.set via TSAsExpression
            {
                code: "const url = new URL('https://example.com'); (url as URL).searchParams.set('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression wrapping URL
            {
                code: "const url = new URL('https://example.com'); (url satisfies URL).hash = '#v2';",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion (angle bracket) wrapping URL
            {
                code: "const url = new URL('https://example.com'); (<URL>url).hash = '#v2';",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const url = new URL('https://example.com'); url.toString();",
            "const url = new URL('https://example.com?q=1'); url.searchParams.get('q');",
            "const custom = { hash: '' }; custom.hash = '#mutable';",
            {
                code: "const url = new URL('https://example.com'); url.hash = '#v2';",
                options: [{ ignorePattern: "^url$" }],
            },
            {
                code: "const url = new URL('https://example.com'); url.searchParams.set('q', '1');",
                options: [{ ignoreAccessorPattern: "url.searchParams" }],
            },
            "let url = new URL('https://example.com'); url = getReplacement(); url.hash = '#v2'; function getReplacement() { return { hash: '' }; }",
            // Non-URL new expression - URLSearchParams or other type
            "const params = new URLSearchParams('a=1'); params.set('b', '2');",
        ],
    });
});
