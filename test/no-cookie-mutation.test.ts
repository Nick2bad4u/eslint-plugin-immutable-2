import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-cookie-mutation rule", () => {
    it("exports no-cookie-mutation rule module", () => {
        expect.hasAssertions();
        expect(getPluginRule("no-cookie-mutation")).toBeDefined();
    });

    tester.run("no-cookie-mutation", getPluginRule("no-cookie-mutation"), {
        invalid: [
            {
                code: "document.cookie = 'theme=dark';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "window.document.cookie = 'token=abc';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "delete document.cookie;",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "cookieStore.set({ name: 'theme', value: 'dark' });",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const store = cookieStore; store.delete('theme');",
                errors: [{ messageId: "generic" }],
            },
            // TSNonNullExpression
            {
                code: "cookieStore!.set('k', 'v');",
                errors: [{ messageId: "generic" }],
            },
            // TSSatisfiesExpression
            {
                code: "(document satisfies Document).cookie = 'theme=dark';",
                errors: [{ messageId: "generic" }],
            },
            // TSTypeAssertion
            {
                code: "(<Document>document).cookie = 'theme=dark';",
                errors: [{ messageId: "generic" }],
            },
            // TSAsExpression
            {
                code: "(document as Document).cookie = 'theme=dark';",
                errors: [{ messageId: "generic" }],
            },
            // ChainExpression (window?.document)
            {
                code: "(window?.document).cookie = 'theme=dark';",
                errors: [{ messageId: "generic" }],
            },
            // UpdateExpression
            {
                code: "document.cookie++;",
                errors: [{ messageId: "generic" }],
            },
            // MemberExpression path for cookieStore (window.cookieStore)
            {
                code: "window.cookieStore.set({ name: 'x', value: 'y' });",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "const raw = document.cookie;",
            "cookieStore.get('theme');",
            "const cookieStore = { set() {} }; cookieStore.set('x', 'y');",
            // CalleObject is CallExpression - not tracked as cookieStore
            "getCookieStore().set({ name: 'x', value: 'y' });",
            {
                code: "document.cookie = 'theme=dark';",
                options: [{ ignorePattern: "^document$" }],
            },
            {
                code: "const store = cookieStore; store.delete('theme');",
                options: [{ ignorePattern: "^store$" }],
            },
            "let store = cookieStore; store = getStore(); store.set('x', 'y'); function getStore() { return { set() {} }; }",
        ],
    });
});
