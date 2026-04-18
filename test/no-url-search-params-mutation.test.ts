import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-url-search-params-mutation rule", () => {
    it("exports no-url-search-params-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-url-search-params-mutation")).toBeDefined();
    });

    tester.run(
        "no-url-search-params-mutation",
        getPluginRule("no-url-search-params-mutation"),
        {
            invalid: [
                {
                    code: "const params = new URLSearchParams('q=1'); params.set('q', '2');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const params = new URLSearchParams(); params.append('page', '2');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const params = new URLSearchParams('a=1&b=2'); params.delete('a');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const input = new URLSearchParams('x=1&y=2'); const alias = input; alias.sort();",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "new URLSearchParams('x=1').set('x', '2');",
                    errors: [{ messageId: "generic" }],
                },
                // TSSatisfiesExpression
                {
                    code: "const params = new URLSearchParams('q=1'); (params satisfies URLSearchParams).set('q', '2');",
                    errors: [{ messageId: "generic" }],
                },
                // TSTypeAssertion
                {
                    code: "const params = new URLSearchParams('q=1'); (<URLSearchParams>params).set('q', '2');",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression
                {
                    code: "const params = new URLSearchParams('q=1'); params!.set('q', '2');",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const params = new URLSearchParams('a=1'); params.get('a');",
                "const query = 'a=1'; query.replace('a', 'b');",
                {
                    code: "const params = new URLSearchParams('q=1'); params.set('q', '2');",
                    options: [{ ignoreAccessorPattern: "params" }],
                },
                {
                    code: "const params = new URLSearchParams('q=1'); params.set('q', '2');",
                    options: [{ ignorePattern: "^params$" }],
                },
                "let params = new URLSearchParams('q=1'); params = getReplacement(); params.set('q', '2'); function getReplacement() { return new Map(); }",
            ],
        }
    );
});
