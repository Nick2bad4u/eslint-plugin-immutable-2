import { existsSync } from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import immutablePlugin from "../src/plugin";

describe("immutable rule docs", () => {
    it("every rule exposes a docs url", () => {
        for (const [ruleName, rule] of Object.entries(immutablePlugin.rules)) {
            const url = rule.meta?.docs?.url;

            expect(url, `Missing docs url for ${ruleName}`).toBeDefined();
            expect(typeof url).toBe("string");
            expect(url).toContain(`/rules/${ruleName}`);
        }
    });

    it("every rule has docs/rules/<rule>.md", () => {
        for (const ruleName of Object.keys(immutablePlugin.rules)) {
            const docsPath = path.resolve(
                process.cwd(),
                "docs",
                "rules",
                `${ruleName}.md`
            );

            expect(
                existsSync(docsPath),
                `Missing docs file for ${ruleName}`
            ).toBeTruthy();
        }
    });

    it("every rule declares immutable metadata defaults", () => {
        const rulesRequiringTypeChecking = new Set([
            "immutable-data",
            "readonly-array",
        ]);

        for (const [ruleName, rule] of Object.entries(immutablePlugin.rules)) {
            const docsMeta = rule.meta?.docs;
            const frozen = Reflect.get(docsMeta ?? {}, "frozen");
            const requiresTypeChecking = Reflect.get(
                docsMeta ?? {},
                "requiresTypeChecking"
            );

            expect(
                rule.meta?.deprecated,
                `Missing deprecated flag for ${ruleName}`
            ).toBeFalsy();
            expect(
                frozen,
                `Missing frozen docs flag for ${ruleName}`
            ).toBeFalsy();

            const expectedRequiresTypeChecking =
                rulesRequiringTypeChecking.has(ruleName);

            expect(
                requiresTypeChecking,
                `Unexpected requiresTypeChecking for ${ruleName}`
            ).toBe(expectedRequiresTypeChecking);
        }
    });
});
