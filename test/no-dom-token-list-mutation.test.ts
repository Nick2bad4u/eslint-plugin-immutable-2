import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-dom-token-list-mutation rule", () => {
    it("exports no-dom-token-list-mutation rule module", () => {
        expect(getPluginRule("no-dom-token-list-mutation")).toBeDefined();
    });

    tester.run(
        "no-dom-token-list-mutation",
        getPluginRule("no-dom-token-list-mutation"),
        {
            invalid: [
                {
                    code: "element.classList.add('active');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "link.relList.remove('preload');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const tokens = element.classList; tokens.toggle('open');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "element.part.replace('old', 'new');",
                    errors: [{ messageId: "generic" }],
                },
                // TSSatisfiesExpression
                {
                    code: "const tokens = element.classList; (tokens satisfies DOMTokenList).add('active');",
                    errors: [{ messageId: "generic" }],
                },
                // TSTypeAssertion
                {
                    code: "const tokens = element.classList; (<DOMTokenList>tokens).add('active');",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression
                {
                    code: "const tokens = element.classList; tokens!.add('active');",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "element.classList.contains('active');",
                "link.relList.supports('preload');",
                "const tokens = getTokens(); tokens.add('active'); function getTokens() { return { add() {} }; }",
                {
                    code: "element.classList.add('active');",
                    options: [
                        { ignorePattern: String.raw`^element\.classList$` },
                    ],
                },
                {
                    code: "const tokens = element.classList; tokens.toggle('open');",
                    options: [{ ignorePattern: "^tokens$" }],
                },
                "let tokens = element.classList; tokens = getTokens(); tokens.toggle('open'); function getTokens() { return { toggle() {} }; }",
                // Undeclared variable - not tracked
                "undeclaredTokens.add('active');",
            ],
        }
    );
});
