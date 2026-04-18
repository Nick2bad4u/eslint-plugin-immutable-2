/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical rule metadata.
 */
// @ts-nocheck

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// @ts-expect-error -- dist output is generated during build/publish.
import builtPlugin from "../dist/plugin.js";

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         docs?: {
 *             url?: string;
 *         };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} ReadmeRuleModule
 */

/** @typedef {Readonly<Record<string, ReadmeRuleModule>>} ReadmeRulesMap */

/**
 * @typedef {"all"
 *     | "functional"
 *     | "functional-lite"
 *     | "immutable"
 *     | "recommended"} PresetName
 */

/**
 * Canonical metadata for README preset icon rendering.
 *
 * @type {Readonly<
 *     Record<PresetName, Readonly<{ icon: string; readmeOrder: number }>>
 * >}
 */
const immutableConfigMetadataByName = {
    "functional-lite": {
        icon: "🟢",
        readmeOrder: 1,
    },
    functional: {
        icon: "🟡",
        readmeOrder: 2,
    },
    immutable: {
        icon: "🟠",
        readmeOrder: 3,
    },
    recommended: {
        icon: "🔵",
        readmeOrder: 4,
    },
    all: {
        icon: "🟣",
        readmeOrder: 5,
    },
};

/** Stable README legend/rendering order for preset icons. */
const immutableConfigNamesByReadmeOrder = [
    "functional-lite",
    "functional",
    "immutable",
    "recommended",
    "all",
];

const presetOrder = [...immutableConfigNamesByReadmeOrder];

const rulesSectionHeading = "## Rules";
const PRESET_DOCS_URL_BASE =
    "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets";

/**
 * Locate the rules section bounds within README markdown.
 *
 * @param {string} markdown
 *
 * @returns {Readonly<{ endOffset: number; startOffset: number }>}
 */
const getReadmeRulesSectionBounds = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);

    if (startOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

/**
 * Extract the README rules section without including the blank separator line
 * that belongs to the following section.
 *
 * @param {string} markdown
 *
 * @returns {string}
 */
export const extractReadmeRulesSection = (markdown) => {
    const { endOffset, startOffset } = getReadmeRulesSectionBounds(markdown);

    return markdown.slice(startOffset, endOffset);
};

/**
 * Normalize markdown table row spacing so formatter-aligned columns compare
 * equivalently to compact generated rows.
 *
 * @param {string} markdown
 *
 * @returns {string}
 */
export const normalizeRulesSectionMarkdown = (markdown) =>
    markdown
        .replaceAll("\r\n", "\n")
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trimEnd();

            if (!/^\|.*\|$/v.test(trimmedLine)) {
                return trimmedLine;
            }

            const cells = trimmedLine
                .split("|")
                .slice(1, -1)
                .map((cell) => {
                    const trimmedCell = cell.trim();

                    if (!/^:?-+:?$/v.test(trimmedCell)) {
                        return trimmedCell;
                    }

                    const hasStartColon = trimmedCell.startsWith(":");
                    const hasEndColon = trimmedCell.endsWith(":");

                    if (hasStartColon && hasEndColon) {
                        return ":-:";
                    }

                    if (hasStartColon) {
                        return ":--";
                    }

                    if (hasEndColon) {
                        return "--:";
                    }

                    return "---";
                });

            return `| ${cells.join(" | ")} |`;
        })
        .join("\n")
        .trimEnd();

/** @type {Readonly<Record<PresetName, string>>} */
const presetDocsSlugByName = {
    all: "all",
    functional: "functional",
    "functional-lite": "functional-lite",
    immutable: "immutable",
    recommended: "recommended",
};

/** @type {Readonly<Record<PresetName, string>>} */
const presetConfigReferenceByName = {
    all: "immutable.configs.all",
    functional: "immutable.configs.functional",
    "functional-lite": 'immutable.configs["functional-lite"]',
    immutable: "immutable.configs.immutable",
    recommended: "immutable.configs.recommended",
};

/**
 * @param {PresetName} presetName
 *
 * @returns {Readonly<Record<string, unknown>>}
 */
const getPresetRulesRecord = (presetName) => {
    const configs = builtPlugin.configs;
    const preset = configs?.[presetName];

    if (typeof preset !== "object" || preset === null) {
        throw new TypeError(`Plugin preset '${presetName}' is missing.`);
    }

    const rules = preset.rules;

    if (typeof rules !== "object" || rules === null || Array.isArray(rules)) {
        throw new TypeError(
            `Plugin preset '${presetName}' is missing a valid rules object.`
        );
    }

    return rules;
};

/** @type {Readonly<Record<PresetName, ReadonlySet<string>>>} */
const presetRuleIdsByName = Object.freeze(
    Object.fromEntries(
        presetOrder.map((presetName) => [
            presetName,
            new Set(Object.keys(getPresetRulesRecord(presetName))),
        ])
    )
);

/**
 * @param {PresetName} presetName
 *
 * @returns {string}
 */
const createPresetDocsUrl = (presetName) =>
    `${PRESET_DOCS_URL_BASE}/${presetDocsSlugByName[presetName]}`;

/**
 * @returns {readonly string[]}
 */
const createPresetLegendLines = () =>
    presetOrder.map((presetName) => {
        const docsUrl = createPresetDocsUrl(presetName);
        const presetIcon = immutableConfigMetadataByName[presetName].icon;
        const configReference = presetConfigReferenceByName[presetName];

        return `  - [${presetIcon}](${docsUrl}) — [\`${configReference}\`](${docsUrl})`;
    });

/**
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {"—" | "💡" | "🔧" | "🔧 💡"}
 */
const getRuleFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const getPresetIndicator = (ruleName) => {
    const ruleId = `immutable/${ruleName}`;
    /** @type {string[]} */
    const icons = [];

    for (const presetName of presetOrder) {
        if (presetRuleIdsByName[presetName].has(ruleId)) {
            const docsUrl = createPresetDocsUrl(presetName);
            const presetIcon = immutableConfigMetadataByName[presetName].icon;

            icons.push(`[${presetIcon}](${docsUrl})`);
        }
    }

    return icons.length === 0 ? "—" : icons.join(" ");
};

/**
 * @param {readonly [string, ReadmeRuleModule]} entry
 *
 * @returns {string}
 */
const toRuleTableRow = ([ruleName, ruleModule]) => {
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} | ${getPresetIndicator(ruleName)} |`;
};

/**
 * Generate the canonical README rules section from plugin rules metadata.
 *
 * @param {ReadmeRulesMap} rules - Plugin `rules` map.
 *
 * @returns {string} Full markdown section text starting at `## Rules`.
 */
export const generateReadmeRulesSectionFromRules = (rules) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    const rows = ruleEntries.map(toRuleTableRow);

    return [
        "## Rules",
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "- `Preset key` legend:",
        ...createPresetLegendLines(),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-- |",
        ...rows,
        "",
    ].join("\n");
};

/**
 * Synchronize the README rules table with canonical plugin metadata.
 *
 * @param {{ writeChanges: boolean }} input
 *
 * @returns {Promise<Readonly<{ changed: boolean }>>}
 */
export const syncReadmeRulesTable = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const readmePath = resolve(workspaceRoot, "README.md");
    const readmeText = await readFile(readmePath, "utf8");

    const { endOffset, startOffset } = getReadmeRulesSectionBounds(readmeText);
    const readmePrefix = readmeText.slice(0, startOffset).trimEnd();
    const readmeSuffix = readmeText.slice(endOffset);

    const generatedRulesSection = generateReadmeRulesSectionFromRules(
        /** @type {ReadmeRulesMap} */ (builtPlugin.rules)
    );

    const existingRulesSection = extractReadmeRulesSection(readmeText);

    if (
        normalizeRulesSectionMarkdown(existingRulesSection) ===
        normalizeRulesSectionMarkdown(generatedRulesSection)
    ) {
        return {
            changed: false,
        };
    }

    const nextReadmeText = `${readmePrefix}\n\n${generatedRulesSection}${readmeSuffix}`;

    if (readmeText === nextReadmeText) {
        return {
            changed: false,
        };
    }

    if (!writeChanges) {
        return {
            changed: true,
        };
    }

    await writeFile(readmePath, nextReadmeText, "utf8");

    return {
        changed: true,
    };
};

const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncReadmeRulesTable({ writeChanges });

    if (!result.changed) {
        console.log("README rules table is already synchronized.");

        return;
    }

    if (writeChanges) {
        console.log("README rules table synchronized from plugin metadata.");

        return;
    }

    console.error(
        "README rules table is out of sync. Run: npm run sync:readme-rules-table:write (or npm run sync:readme-rules-table:update to refresh snapshots too)."
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await runCli();
}
