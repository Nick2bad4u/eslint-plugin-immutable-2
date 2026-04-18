import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-mixed-interface rule", () => {
    it("exports no-mixed-interface rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-mixed-interface")).toBeDefined();
    });

    tester.run("no-mixed-interface", getPluginRule("no-mixed-interface"), {
        invalid: [
            {
                code: `
                    interface Mixed {
                        readonly value: string;
                        compute(input: string): number;
                    }
                `,
                errors: [{ messageId: "generic" }],
            },
            {
                code: `
                    interface Mixed {
                        readonly value: string;
                        readonly compute: (input: string) => number;
                    }
                `,
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            `
                interface ConsistentMethods {
                    compute(input: string): number;
                    stringify(input: number): string;
                }
            `,
            `
                interface ConsistentProperties {
                    readonly value: string;
                    readonly count: number;
                }
            `,
        ],
    });
});
