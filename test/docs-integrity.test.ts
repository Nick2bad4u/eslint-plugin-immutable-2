import { existsSync } from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import plugin from "../src/plugin";

describe("immutable rule docs", () => {
    it("every rule exposes a docs url", () => {
        for (const [ruleName, rule] of Object.entries(plugin.rules)) {
            const url = rule.meta?.docs?.url;

            expect(url, `Missing docs url for ${ruleName}`).toBeDefined();
            expect(typeof url).toBe("string");
            expect(url).toContain(`/rules/${ruleName}`);
        }
    });

    it("every rule has docs/rules/<rule>.md", () => {
        for (const ruleName of Object.keys(plugin.rules)) {
            const docsPath = path.resolve(
                process.cwd(),
                "docs",
                "rules",
                `${ruleName}.md`
            );

            expect(existsSync(docsPath), `Missing docs file for ${ruleName}`).toBeTruthy(
                
            );
        }
    });
});
