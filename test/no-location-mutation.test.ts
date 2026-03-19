import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-location-mutation rule", () => {
    it("exports no-location-mutation rule module", () => {
        expect(getPluginRule("no-location-mutation")).toBeDefined();
    });

    tester.run("no-location-mutation", getPluginRule("no-location-mutation"), {
        invalid: [
            {
                code: "location.assign('/settings');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "window.location.reload();",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "const navLocation = location; navLocation.replace('/account');",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "location.href = 'https://example.com';",
                errors: [{ messageId: "generic" }],
            },
            {
                code: "delete location.hash;",
                errors: [{ messageId: "generic" }],
            },
        ],
        valid: [
            "location.pathname;",
            "const location = { assign() {} }; location.assign('/ok');",
            "const navLocation = getLocation(); navLocation.replace('/ok'); function getLocation() { return { replace() {} }; }",
            {
                code: "location.assign('/safe');",
                options: [{ ignorePattern: "^location$" }],
            },
            {
                code: "const navLocation = location; navLocation.replace('/safe');",
                options: [{ ignorePattern: "^navLocation$" }],
            },
            "let navLocation = location; navLocation = getMutableLocation(); navLocation.href = '/ok'; function getMutableLocation() { return { href: '' }; }",
        ],
    });
});
