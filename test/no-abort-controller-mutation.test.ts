import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-abort-controller-mutation rule", () => {
    it("exports no-abort-controller-mutation rule module", () => {
        expect(getPluginRule("no-abort-controller-mutation")).toBeDefined();
    });

    tester.run(
        "no-abort-controller-mutation",
        getPluginRule("no-abort-controller-mutation"),
        {
            invalid: [
                {
                    code: "const controller = new AbortController(); controller.abort();",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const source = new AbortController(); const alias = source; alias.abort('reason');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "new AbortController().abort();",
                    errors: [{ messageId: "generic" }],
                },
                // TSSatisfiesExpression wrapping AbortController
                {
                    code: "const controller = new AbortController(); (controller satisfies AbortController).abort();",
                    errors: [{ messageId: "generic" }],
                },
                // TSTypeAssertion wrapping AbortController
                {
                    code: "const controller = new AbortController(); (<AbortController>controller).abort();",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression wrapping AbortController
                {
                    code: "const controller = new AbortController(); controller!.abort();",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const controller = new AbortController(); controller.signal;",
                "AbortSignal.abort();",
                "const controller = { abort() {} }; controller.abort();",
                {
                    code: "const controller = new AbortController(); controller.abort();",
                    options: [{ ignorePattern: "^controller$" }],
                },
                "let controller = new AbortController(); controller = getController(); controller.abort(); function getController() { return { abort() {} }; }",
                // Undeclared variable - not tracked as AbortController
                "undeclaredController.abort();",
            ],
        }
    );
});
