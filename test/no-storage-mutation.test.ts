import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-storage-mutation rule", () => {
    it("exports no-storage-mutation rule module", () => {
        expect(getPluginRule("no-storage-mutation")).toBeDefined();
    });

    tester.run("no-storage-mutation", getPluginRule("no-storage-mutation"), {
        invalid: [
            {
                code: "localStorage.setItem('theme', 'dark');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "sessionStorage.removeItem('token');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const storage = localStorage; storage.clear();",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "localStorage.user = 'alice';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "window.sessionStorage.counter++;",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "delete globalThis.localStorage.lastSync;",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const storage = window.localStorage; storage['feature'] = 'enabled';",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression
            {
                code: "(localStorage satisfies Storage).setItem('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion
            {
                code: "(<Storage>localStorage).setItem('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression
            {
                code: "localStorage!.setItem('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
            // ChainExpression (window?.localStorage)
            {
                code: "const storage = window?.localStorage; storage.setItem('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression as callee.object
            {
                code: "const storage = localStorage; (storage as Storage).setItem('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "localStorage.getItem('theme');",
            "sessionStorage.length;",
            "const storage = { setItem() {} }; storage.setItem('theme', 'dark');",
            "const localStorage = { setItem() {} }; localStorage.setItem('theme', 'dark');",
            // Undeclared variable - not tracked as storage
            "undeclaredStore.setItem('key', 'value');",
            {
                code: "localStorage.theme = 'dark';",
                options: [{ ignoreAccessorPattern: "localStorage.**" }],
            },
            {
                code: "const storage = localStorage; storage.theme = 'dark';",
                options: [{ ignorePattern: String.raw`^storage$` }],
            },
            "let storage = localStorage; storage = getMutableStore(); storage.theme = 'dark'; function getMutableStore() { return { theme: '' }; }",
        ],
    });
});
