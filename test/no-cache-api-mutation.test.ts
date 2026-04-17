import { describe, expect, it } from "vitest";

import { createRuleTester, getPluginRule } from "./_internal/ruleTester";

const tester = createRuleTester();

describe("no-cache-api-mutation rule", () => {
    it("exports no-cache-api-mutation rule module", () => {
        expect(getPluginRule("no-cache-api-mutation")).toBeDefined();
    });

    tester.run(
        "no-cache-api-mutation",
        getPluginRule("no-cache-api-mutation"),
        {
            invalid: [
                {
                    code: "caches.delete('v1');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "async function hydrate(req, res) { const cache = await caches.open('v1'); await cache.put(req, res); }",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "async function prime() { const cache = await caches.open('v1'); await cache.add('/index.html'); }",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "const cacheStorage = caches; cacheStorage.delete('v2');",
                    errors: [{ messageId: "generic" }],
                },
                {
                    code: "async function drop(req) { const cache = await caches.open('v1'); await cache.delete(req); }",
                    errors: [{ messageId: "generic" }],
                },
                // TSNonNullExpression
                {
                    code: "const cacheStorage = caches; cacheStorage!.delete('v2');",
                    errors: [{ messageId: "generic" }],
                },
            ],
            valid: [
                "caches.keys();",
                "async function read(req) { const cache = await caches.open('v1'); await cache.match(req); }",
                "const caches = { delete() {} }; caches.delete('v1');",
                {
                    code: "caches.delete('v1');",
                    options: [{ ignorePattern: "^caches$" }],
                },
                {
                    code: "async function hydrate(req, res) { const cache = await caches.open('v1'); await cache.put(req, res); }",
                    options: [{ ignorePattern: "^cache$" }],
                },
                "async function run(req, res) { let cache = await caches.open('v1'); cache = getCache(); await cache.put(req, res); } function getCache() { return { put() {} }; }",
            ],
        }
    );
});
