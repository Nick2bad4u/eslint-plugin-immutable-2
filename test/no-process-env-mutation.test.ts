import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-process-env-mutation rule", () => {
    it("exports no-process-env-mutation rule module", () => {
        expect(getPluginRule("no-process-env-mutation")).toBeDefined();
    });

    tester.run(
        "no-process-env-mutation",
        getPluginRule("no-process-env-mutation"),
        {
            invalid: [
                {
                    code: "process.env.NODE_ENV = 'production';",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "process.env['API_KEY'] = 'secret';",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "delete process.env.DEBUG;",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const env = process.env; env.PORT = '3000';",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "process.env = { ...process.env, MODE: 'test' };",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "process.env.RETRY_COUNT++;",
                    errors: [{ messageId: "generic" }],
                },
                // TSSatisfiesExpression wrapping process.env
                {
                    code: "(process.env satisfies NodeJS.ProcessEnv).NODE_ENV = 'test';",
                    errors: [{ messageId: "generic" }],
                },
                // TSTypeAssertion wrapping process.env
                {
                    code: "(<NodeJS.ProcessEnv>process.env).NODE_ENV = 'test';",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression wrapping process.env
                {
                    code: "process.env!.NODE_ENV = 'test';",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "const mode = process.env.NODE_ENV;",
                "Object.keys(process.env);",
                "const env = getEnv(); env.PORT = '3000'; function getEnv() { return {}; }",
                {
                    code: "process.env.NODE_ENV = 'production';",
                    options: [{ ignorePattern: String.raw`^process\.env$` }],
                },
                {
                    code: "const env = process.env; env.PORT = '3000';",
                    options: [{ ignorePattern: "^env$" }],
                },
                "let env = process.env; env = getReplacement(); env.PORT = '3000'; function getReplacement() { return {}; }",
            ],
        }
    );
});
