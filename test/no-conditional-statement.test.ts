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
                // Switch statement - unexpectedSwitch (allowReturningBranches: false)
                {
                    code: `
                        function toNumber(input: string): number {
                            switch (input) {
                                case "a": return 1;
                                default: return 0;
                            }
                        }
                    `,
                    errors: [{ messageId: "unexpectedSwitch" }],
                },
                // Switch statement - incompleteSwitch (ifExhaustive + no default)
                {
                    code: `
                        function toNumber(input: string): number {
                            switch (input) {
                                case "a": return 1;
                                case "b": return 2;
                            }
                            return 0;
                        }
                    `,
                    errors: [{ messageId: "incompleteSwitch" }],
                    options: [{ allowReturningBranches: "ifExhaustive" }],
                },
                // Switch statement - incompleteBranch (allowReturningBranches: true, case without return)
                {
                    code: `
                        function handle(input: string): void {
                            switch (input) {
                                case "a":
                                    console.log("side-effect");
                                    break;
                                default:
                                    return;
                            }
                        }
                    `,
                    errors: [{ messageId: "incompleteBranch" }],
                    options: [{ allowReturningBranches: true }],
                },
                // IncompleteBranch for if with block and no return
                {
                    code: `
                        function process(input: string): string {
                            if (input === "a") {
                                const x = 1;
                                const y = 2;
                            } else {
                                return "other";
                            }
                            return "end";
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
                // Switch with returning cases (allowReturningBranches: true)
                {
                    code: `
                        function toNumber(input: string): number {
                            switch (input) {
                                case "a": return 1;
                                case "b": return 2;
                                default: return 0;
                            }
                        }
                    `,
                    options: [{ allowReturningBranches: true }],
                },
                // Switch with block statements containing returns (getSwitchCaseViolations block path)
                {
                    code: `
                        function toNumber(input: string): number {
                            switch (input) {
                                case "a": {
                                    return 1;
                                }
                                default: {
                                    return 0;
                                }
                            }
                        }
                    `,
                    options: [{ allowReturningBranches: true }],
                },
                // Switch with empty case (fall-through)
                {
                    code: `
                        function toNumber(input: string): number {
                            switch (input) {
                                case "a":
                                case "b":
                                    return 1;
                                default:
                                    return 0;
                            }
                        }
                    `,
                    options: [{ allowReturningBranches: true }],
                },
                // If with nested if as alternate (valid when that nested if returns)
                {
                    code: `
                        function process(input: string): string {
                            if (input === "a") {
                                return "A";
                            } else if (input === "b") {
                                return "B";
                            } else {
                                return "other";
                            }
                        }
                    `,
                    options: [{ allowReturningBranches: true }],
                },
            ],
        }
    );
});
