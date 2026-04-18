import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-method-signature rule", () => {
    it("exports no-method-signature rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-method-signature")).toBeDefined();
    });

    tester.run("no-method-signature", getPluginRule("no-method-signature"), {
        invalid: [
            {
                code: "interface Service { run(input: string): string; }",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestReadonlyProperty",
                                output: "interface Service { readonly run: (input: string) => string; }",
                            },
                        ],
                    },
                ],
            },
            {
                code: "type Service = { run(input: string): string };",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestReadonlyProperty",
                                output: "type Service = { readonly run: (input: string) => string; };",
                            },
                        ],
                    },
                ],
            },
            // Method WITHOUT explicit return type (returnType === undefined → void)
            {
                code: "interface Service { run(input: string); }",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestReadonlyProperty",
                                output: "interface Service { readonly run: (input: string) => void; }",
                            },
                        ],
                    },
                ],
            },
            // Optional method (optional === true → "?")
            {
                code: "interface Service { run?(input: string): string; }",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestReadonlyProperty",
                                output: "interface Service { readonly run?: (input: string) => string; }",
                            },
                        ],
                    },
                ],
            },
            // Method WITH type parameters
            {
                code: "interface Service { run<T>(input: T): T; }",
                errors: [
                    {
                        messageId: "generic",
                        suggestions: [
                            {
                                messageId: "suggestReadonlyProperty",
                                output: "interface Service { readonly run: <T>(input: T) => T; }",
                            },
                        ],
                    },
                ],
            },
        ],
        valid: [
            "interface Service { readonly run: (input: string) => string; }",
            "type Service = { readonly run: (input: string) => string };",
        ],
    });
});
