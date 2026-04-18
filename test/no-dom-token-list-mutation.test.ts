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
                // ChainExpression wrapping classList - unwrapExpression ChainExpression path
                {
                    code: "(element?.classList).add('active');",
                    errors: [{ messageId: "generic" }],
                },
                // TSAsExpression wrapping classList - unwrapExpression TSAsExpression path
                {
                    code: "(element.classList as DOMTokenList).add('active');",
                    errors: [{ messageId: "generic" }],
                },
                // Computed string property - getMemberPropertyName computed branch
                {
                    code: "element['classList'].add('active');",
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
                // Computed non-string property - getMemberPropertyName returns null, not a DOMTokenList property
                "element[0].add('active');",
                // AssignmentExpression where left is MemberExpression (not Identifier) - rule returns early
                "element.classList = null;",
                // AssignmentExpression to undeclared variable - resolveVariable returns null in
                // markDomTokenListVariable
                "undeclaredVar2 = element.classList;",
                // VariableDeclarator where id is destructuring (not Identifier) - rule returns early
                "const [a, b] = element.classList;",
            ],
        }
    );
});
