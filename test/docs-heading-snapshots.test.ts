/**
 * @packageDocumentation
 * Contract coverage for immutable rule docs heading schemas.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import immutablePlugin from "../src/plugin";
import { parseMarkdownHeadingsAtLevel } from "./_internal/markdown-headings";

/** Parse all H2 headings from markdown in order. */
const parseH2Headings = (markdown: string): readonly string[] =>
    parseMarkdownHeadingsAtLevel(markdown, 2);

const canonicalRuleHeadings = [
    "Targeted pattern scope",
    "What this rule reports",
    "Why this rule exists",
    "❌ Incorrect",
    "✅ Correct",
    "Additional examples",
    "ESLint flat config example",
    "When not to use it",
    "Further reading",
] as const;

const ruleCatalogIdPattern = /> \*\*Rule catalog ID:\*\* R\d{3}/v;

describe("rule docs heading snapshots", () => {
    it("enforces canonical immutable docs headings for every exported rule", () => {
        expect.hasAssertions();

        const ruleNames = Object.keys(immutablePlugin.rules).toSorted(
            (left, right) => left.localeCompare(right)
        );

        for (const ruleName of ruleNames) {
            const docsFilePath = path.join(
                process.cwd(),
                "docs",
                "rules",
                `${ruleName}.md`
            );

            const markdown = fs.readFileSync(docsFilePath, "utf8");
            const headings = parseH2Headings(markdown);

            expect(
                headings,
                `Unexpected heading sequence for ${ruleName}`
            ).toStrictEqual(canonicalRuleHeadings);
            expect(
                markdown,
                `Missing rule catalog id marker for ${ruleName}`
            ).toMatch(ruleCatalogIdPattern);
        }
    });
});
