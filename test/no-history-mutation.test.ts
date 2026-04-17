import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-history-mutation rule", () => {
    it("exports no-history-mutation rule module", () => {
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
        ],
    });
});
