import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-history-mutation rule", () => {
    it("exports no-history-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-history-mutation")).toBeDefined();
    });

    tester.run("no-history-mutation", getPluginRule("no-history-mutation"), {
        invalid: [
            {
                code: "history.pushState({ step: 2 }, '', '/step-2');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "window.history.replaceState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const navHistory = history; navHistory.back();",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "history.scrollRestoration = 'manual';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "delete history.state;",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression
            {
                code: "(history satisfies History).pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion
            {
                code: "(<History>history).pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression
            {
                code: "history!.pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // ChainExpression wrapping window.history - unwrapExpression ChainExpression path
            {
                code: "(window?.history).pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression wrapping history - unwrapExpression TSAsExpression path
            {
                code: "(history as History).scrollRestoration = 'manual';",
                errors: [{ messageId: "generic" }],
            },
            // Computed string property access - getMemberPropertyName computed branch
            {
                code: "window['history'].pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // globalThis host global
            {
                code: "globalThis.history.pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // Self host global
            {
                code: "self.history.pushState({}, '', '/next');",
                errors: [{ messageId: "generic" }],
            },
            // UpdateExpression on history property
            {
                code: "history.scrollRestoration++;",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "history.state;",
            "const history = { pushState() {} }; history.pushState({}, '', '/');",
            "const navHistory = getHistory(); navHistory.back(); function getHistory() { return { back() {} }; }",
            {
                code: "history.pushState({}, '', '/ok');",
                options: [{ ignorePattern: "^history$" }],
            },
            {
                code: "const navHistory = history; navHistory.back();",
                options: [{ ignorePattern: "^navHistory$" }],
            },
            "let navHistory = history; navHistory = getMutableHistory(); navHistory.back(); function getMutableHistory() { return { back() {} }; }",
            // UnaryExpression with non-delete operator - returns early (operator !== 'delete')
            "!history.state;",
            // GetMemberPropertyName returns null - computed non-string property, not a history host
            "window[0].pushState({}, '', '/');",
            // Undeclared variable - resolveVariable traverses scope chain (scope.upper) and returns null
            "undeclaredHistory.pushState({}, '', '/');",
            // VariableDeclarator where id is destructuring (not Identifier) - rule returns early
            "const { state } = history;",
        ],
    });
});
