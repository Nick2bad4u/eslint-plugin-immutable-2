import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-conditional-statement rule", () => {
    it("exports no-conditional-statement rule module", () => {
        expect(getPluginRule("no-conditional-statement")).toBeDefined();
    });

    tester.run(
        "no-conditional-statement",
        getPluginRule("no-conditional-statement"),
        {
            invalid: [
                {
                    code: "if (value > 0) { return value; }",
                    errors: [{ messageId: "unexpectedIf" }],
                },
                {
                    code: `
                        function toLabel(input: string): string {
                            if (input === "a") {
                                return "A";
                            }

                            return "other";
                        }
                    `,
                    errors: [{ messageId: "incompleteIf" }],
                    options: [{ allowReturningBranches: "ifExhaustive" }],
                },
                {
                    code: `
                        function toMessage(input: string): string {
                            if (input === "a") {
                                console.log("side-effect");
                            }

                            return "other";
                        }
                    `,
                    errors: [{ messageId: "incompleteBranch" }],
                    options: [{ allowReturningBranches: true }],
                },
            ],
            valid: [
                {
                    code: `
                        function toLabel(input: string): string {
                            if (input === "a") {
                                return "A";
                            } else {
                                return "other";
                            }
                        }
                    `,
                    options: [{ allowReturningBranches: true }],
                },
                {
                    code: `
                        function toNumber(input: "a" | "b"): number {
                            switch (input) {
                                case "a":
                                    return 1;
                                case "b":
                                    return 2;
                                default:
                                    return 3;
                            }
                        }
                    `,
                    options: [{ allowReturningBranches: "ifExhaustive" }],
                },
            ],
        }
    );
});
