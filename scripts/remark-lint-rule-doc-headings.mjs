/**
 * @file Remark lint plugin enforcing canonical H2 heading order for helper
 *   docs.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** @typedef {import("mdast").Heading} Heading */
/** @typedef {import("mdast").Root} Root */
/** @typedef {import("unist").Node} Node */
/** @typedef {import("vfile").VFile} VFile */
/** @typedef {{ name?: unknown }} PackageMetadata */
/** @typedef {boolean | undefined} HeadingToggle */

/**
 * @typedef {{
 *     headings?: Partial<Record<string, HeadingToggle>>;
 *     helperDocPathPattern?: RegExp;
 *     requirePackageDocumentation?: boolean;
 *     requirePackageDocumentationLabel?: boolean;
 *     packageDocumentationLabelPattern?: RegExp;
 *     ruleCatalogIdLinePattern?: RegExp;
 *     ruleNamespaceAliases?: readonly string[];
 * }} RemarkLintRuleDocHeadingsOptions
 */

const canonicalHeadingDefinitions = [
    {
        heading: "Targeted pattern scope",
        key: "targetedPatternScope",
        requiredByDefault: true,
    },
    {
        heading: "What this rule reports",
        key: "whatThisRuleReports",
        requiredByDefault: true,
    },
    {
        heading: "Why this rule exists",
        key: "whyThisRuleExists",
        requiredByDefault: true,
    },
    { heading: "❌ Incorrect", key: "incorrect", requiredByDefault: true },
    { heading: "✅ Correct", key: "correct", requiredByDefault: true },
    { heading: "Deprecated", key: "deprecated", requiredByDefault: false },
    {
        heading: "Behavior and migration notes",
        key: "behaviorAndMigrationNotes",
        requiredByDefault: false,
    },
    {
        heading: "Additional examples",
        key: "additionalExamples",
        requiredByDefault: true,
    },
    {
        heading: "ESLint flat config example",
        key: "eslintFlatConfigExample",
        requiredByDefault: true,
    },
    {
        heading: "When not to use it",
        key: "whenNotToUseIt",
        requiredByDefault: true,
    },
    {
        heading: "Package documentation",
        key: "packageDocumentation",
        requiredByDefault: false,
    },
    {
        heading: "Further reading",
        key: "furtherReading",
        requiredByDefault: true,
    },
    {
        heading: "Adoption resources",
        key: "adoptionResources",
        requiredByDefault: false,
    },
];

const optionalDetailHeadingDefinitions = [
    { heading: "Matched patterns", key: "matchedPatterns" },
    { heading: "Detection boundaries", key: "detectionBoundaries" },
];

const canonicalHeadingOrder = canonicalHeadingDefinitions.map(
    (definition) => definition.heading
);

const canonicalHeadingDefinitionsByTitle = new Map(
    canonicalHeadingDefinitions.map((definition) => [
        definition.heading,
        definition,
    ])
);

const optionalDetailHeadingDefinitionsByTitle = new Map(
    optionalDetailHeadingDefinitions.map((definition) => [
        definition.heading,
        definition,
    ])
);

const defaultHeadingToggles = Object.freeze(
    Object.fromEntries(
        [
            ...canonicalHeadingDefinitions,
            ...optionalDetailHeadingDefinitions,
        ].map((definition) => [definition.key, true])
    )
);

const optionalDetailAllowedParentHeadings = new Set([
    "Targeted pattern scope",
    "What this rule reports",
]);

const defaultHelperDocPathPattern =
    /(^|\/)docs\/rules\/(?!overview\.md$|getting-started\.md$|presets\/)[^/]+\.md$/u;
const defaultRuleCatalogIdLinePattern = /^> \*\*Rule catalog ID:\*\* R\d{3}$/u;
const defaultPackageDocumentationLabelPattern =
    /^[^\r\n]+ package documentation:$/mu;
const eslintPluginPackagePrefix = "eslint-plugin-";

const packageMetadataCache = new Map();

/**
 * Populates the package metadata cache for all traversed directories.
 *
 * @param {string[]} dirs
 * @param {PackageMetadata | undefined} value
 */
const cacheTraversedDirectories = (dirs, value) => {
    for (const dir of dirs) {
        packageMetadataCache.set(dir, value);
    }
};

/**
 * @param {string} documentPath
 *
 * @returns {PackageMetadata | undefined}
 */
const getNearestPackageMetadata = (documentPath) => {
    const traversedDirectories = [];
    let currentDirectory = dirname(documentPath);

    while (true) {
        traversedDirectories.push(currentDirectory);

        if (packageMetadataCache.has(currentDirectory)) {
            const cachedPackageMetadata =
                packageMetadataCache.get(currentDirectory);

            cacheTraversedDirectories(
                traversedDirectories,
                cachedPackageMetadata
            );

            return cachedPackageMetadata;
        }

        const packageJsonPath = join(currentDirectory, "package.json");

        if (existsSync(packageJsonPath)) {
            let packageMetadata;

            try {
                packageMetadata = /** @type {PackageMetadata} */ (
                    JSON.parse(readFileSync(packageJsonPath, "utf8"))
                );
            } catch {
                packageMetadata = undefined;
            }

            cacheTraversedDirectories(traversedDirectories, packageMetadata);

            return packageMetadata;
        }

        const parentDirectory = dirname(currentDirectory);

        if (parentDirectory === currentDirectory) {
            cacheTraversedDirectories(traversedDirectories, undefined);

            return undefined;
        }

        currentDirectory = parentDirectory;
    }
};

/**
 * @param {unknown} packageName
 *
 * @returns {packageName is string}
 */
const isPackageName = (packageName) => typeof packageName === "string";

/**
 * @param {string} packageName
 *
 * @returns {readonly string[]}
 */
const getRuleNamespaceAliasesFromPackageName = (packageName) => {
    const aliases = new Set();

    if (packageName.startsWith(eslintPluginPackagePrefix)) {
        const pluginName = packageName.slice(eslintPluginPackagePrefix.length);

        if (pluginName !== "") {
            aliases.add(pluginName);
        }

        return [...aliases];
    }

    if (!packageName.startsWith("@")) {
        return [...aliases];
    }

    const packageSeparatorIndex = packageName.indexOf("/");

    if (packageSeparatorIndex === -1) {
        return [...aliases];
    }

    const packageScope = packageName.slice(0, packageSeparatorIndex);
    const scopedPackageName = packageName.slice(packageSeparatorIndex + 1);

    if (!scopedPackageName.startsWith(eslintPluginPackagePrefix)) {
        return [...aliases];
    }

    const pluginName = scopedPackageName.slice(
        eslintPluginPackagePrefix.length
    );

    if (pluginName !== "") {
        aliases.add(pluginName);
        aliases.add(`${packageScope}/${pluginName}`);
    }

    return [...aliases];
};

/**
 * @param {string} fileRuleId
 * @param {readonly string[]} ruleNamespaceAliases
 *
 * @returns {readonly string[]}
 */
const getExpectedH1Titles = (fileRuleId, ruleNamespaceAliases) => {
    const expectedH1Titles = new Set([fileRuleId]);

    if (fileRuleId.startsWith("typescript-")) {
        expectedH1Titles.add(`typescript/${fileRuleId.slice(11)}`);
    }

    for (const ruleNamespaceAlias of ruleNamespaceAliases) {
        expectedH1Titles.add(`${ruleNamespaceAlias}/${fileRuleId}`);
    }

    return [...expectedH1Titles];
};

/**
 * @param {string} path
 *
 * @returns {string}
 */
const normalizePath = (path) => path.replaceAll("\\", "/");

/**
 * @param {unknown} value
 *
 * @returns {value is { value: string }}
 */
const hasValue = (value) =>
    typeof value === "object" && value !== null && "value" in value;

/**
 * @param {unknown} value
 *
 * @returns {value is { children: unknown[] }}
 */
const hasChildren = (value) =>
    typeof value === "object" && value !== null && "children" in value;

/**
 * @param {unknown} node
 *
 * @returns {string}
 */
const getNodeText = (node) => {
    if (hasValue(node) && typeof node.value === "string") {
        return node.value;
    }

    if (hasChildren(node) && Array.isArray(node.children)) {
        return node.children.map((child) => getNodeText(child)).join("");
    }

    return "";
};

/**
 * @param {unknown} value
 *
 * @returns {value is Root}
 */
const isRootNode = (value) =>
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "root" &&
    "children" in value &&
    Array.isArray(value.children);

/**
 * @param {unknown} node
 *
 * @returns {node is Heading}
 */
const isHeadingNode = (node) =>
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    node.type === "heading" &&
    "depth" in node;

/**
 * @param {VFile} file
 * @param {Heading} sectionHeading
 * @param {Heading | undefined} nextSectionHeading
 *
 * @returns {string}
 */
const getSectionContent = (file, sectionHeading, nextSectionHeading) => {
    const sectionStartOffset = sectionHeading.position?.end?.offset;
    const nextSectionOffset = nextSectionHeading?.position?.start?.offset;
    const markdownStartOffset =
        typeof sectionStartOffset === "number" ? sectionStartOffset : 0;
    const markdownEndOffset =
        typeof nextSectionOffset === "number"
            ? nextSectionOffset
            : String(file).length;

    return String(file).slice(markdownStartOffset, markdownEndOffset);
};

/**
 * @param {Root} tree
 * @param {1 | 2} depth
 *
 * @returns {readonly Heading[]}
 */
const getHeadingsByDepth = (tree, depth) =>
    tree.children.filter(
        /**
         * @param {unknown} node
         *
         * @returns {node is Heading}
         */
        (node) =>
            typeof node === "object" &&
            node !== null &&
            "type" in node &&
            node.type === "heading" &&
            "depth" in node &&
            node.depth === depth
    );

// ---------------------------------------------------------------------------
// Validation helper functions (module-level to keep cognitive complexity low)
// ---------------------------------------------------------------------------

/**
 * Wraps a title in backtick characters.
 *
 * @param {string} title
 *
 * @returns {string}
 */
const toBacktick = (title) => `\`${title}\``;

/**
 * Validates that the document contains exactly one H1 heading.
 *
 * @param {readonly Heading[]} h1Headings
 * @param {VFile} file
 */
const checkH1HeadingCount = (h1Headings, file) => {
    if (h1Headings.length !== 1) {
        file.message(
            "Helper docs must contain exactly one H1 heading.",
            h1Headings[0],
            "remark-lint:rule-doc-headings:h1-count"
        );
    }
};

/**
 * Validates that the H1 heading title matches the expected rule name.
 *
 * @param {readonly Heading[]} h1Headings
 * @param {string | undefined} expectedRuleTitle
 * @param {readonly string[]} ruleNamespaceAliases
 * @param {VFile} file
 */
const checkH1HeadingTitle = (
    h1Headings,
    expectedRuleTitle,
    ruleNamespaceAliases,
    file
) => {
    if (h1Headings.length !== 1 || typeof expectedRuleTitle !== "string") {
        return;
    }

    const actualTitle = getNodeText(h1Headings[0]).trim();
    const expectedH1Titles = getExpectedH1Titles(
        expectedRuleTitle,
        ruleNamespaceAliases
    );

    if (!expectedH1Titles.includes(actualTitle)) {
        const titlesFormatted = expectedH1Titles.map(toBacktick).join(", ");

        file.message(
            `H1 heading must match one of: ${titlesFormatted}.`,
            h1Headings[0],
            "remark-lint:rule-doc-headings:h1-title"
        );
    }
};

/**
 * Validates that no H2 heading is duplicated in the document.
 *
 * @param {readonly string[]} headingNames
 * @param {readonly Heading[]} h2Headings
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {VFile} file
 */
const checkDuplicateH2Headings = (
    headingNames,
    h2Headings,
    isHeadingEnabled,
    file
) => {
    const seenHeadings = new Set();

    for (const [index, headingName] of headingNames.entries()) {
        const headingDefinition =
            canonicalHeadingDefinitionsByTitle.get(headingName);

        if (
            headingDefinition !== undefined &&
            !isHeadingEnabled(headingDefinition.key)
        ) {
            continue;
        }

        if (seenHeadings.has(headingName)) {
            file.message(
                `Duplicate H2 heading \`${headingName}\` is not allowed.`,
                h2Headings[index],
                "remark-lint:rule-doc-headings:duplicate-heading"
            );
            continue;
        }

        seenHeadings.add(headingName);
    }
};

/**
 * @typedef {{
 *     currentH2HeadingName: string | undefined;
 *     detectionBoundariesHeadingIndex: number;
 *     matchedPatternsHeadingIndex: number;
 *     optionalDetailHeadings: Set<string>;
 * }} DetailHeadingState
 */

/**
 * Processes a single tree node for detail-heading (H3) validation.
 *
 * @param {unknown} node
 * @param {number} index
 * @param {DetailHeadingState} state
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {VFile} file
 */
const processDetailHeadingNode = (
    node,
    index,
    state,
    isHeadingEnabled,
    file
) => {
    if (!isHeadingNode(node)) {
        return;
    }

    const headingName = getNodeText(node).trim();
    const detailHeadingDefinition =
        optionalDetailHeadingDefinitionsByTitle.get(headingName);

    if (node.depth === 2) {
        state.currentH2HeadingName = headingName;
        return;
    }

    if (
        node.depth !== 3 ||
        detailHeadingDefinition === undefined ||
        !isHeadingEnabled(detailHeadingDefinition.key) ||
        !state.optionalDetailHeadings.has(headingName)
    ) {
        return;
    }

    if (
        state.currentH2HeadingName === undefined ||
        !optionalDetailAllowedParentHeadings.has(state.currentH2HeadingName)
    ) {
        file.message(
            `\`### ${headingName}\` must be placed under \`## Targeted pattern scope\` or \`## What this rule reports\`.`,
            node,
            "remark-lint:rule-doc-headings:detail-heading-parent"
        );
    }

    if (headingName === "Matched patterns") {
        state.matchedPatternsHeadingIndex = index;
    }

    if (headingName === "Detection boundaries") {
        state.detectionBoundariesHeadingIndex = index;
    }
};

/**
 * Validates optional H3 detail headings and their relative order.
 *
 * @param {Root} tree
 * @param {Set<string>} optionalDetailHeadings
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {VFile} file
 */
const checkDetailH3Headings = (
    tree,
    optionalDetailHeadings,
    isHeadingEnabled,
    file
) => {
    /** @type {DetailHeadingState} */
    const state = {
        currentH2HeadingName: undefined,
        detectionBoundariesHeadingIndex: -1,
        matchedPatternsHeadingIndex: -1,
        optionalDetailHeadings,
    };

    for (const [index, node] of tree.children.entries()) {
        processDetailHeadingNode(node, index, state, isHeadingEnabled, file);
    }

    if (
        state.detectionBoundariesHeadingIndex !== -1 &&
        state.matchedPatternsHeadingIndex !== -1 &&
        state.detectionBoundariesHeadingIndex <
            state.matchedPatternsHeadingIndex
    ) {
        const detectionBoundariesNode =
            tree.children[state.detectionBoundariesHeadingIndex];

        file.message(
            "`### Detection boundaries` must appear after `### Matched patterns` when both are present.",
            detectionBoundariesNode,
            "remark-lint:rule-doc-headings:detail-heading-order"
        );
    }
};

/**
 * Validates that H2 headings appear in the canonical order.
 *
 * @param {readonly string[]} headingNames
 * @param {readonly Heading[]} h2Headings
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {Map<string, number>} headingOrderIndex
 * @param {VFile} file
 */
const checkH2HeadingOrder = (
    headingNames,
    h2Headings,
    isHeadingEnabled,
    headingOrderIndex,
    file
) => {
    let lastOrder = -1;

    for (const [index, headingName] of headingNames.entries()) {
        const headingDefinition =
            canonicalHeadingDefinitionsByTitle.get(headingName);

        if (
            headingDefinition !== undefined &&
            !isHeadingEnabled(headingDefinition.key)
        ) {
            continue;
        }

        const headingOrder = headingOrderIndex.get(headingName);
        const headingNode = h2Headings[index];

        if (headingOrder === undefined) {
            file.message(
                `Unexpected H2 heading \`${headingName}\`. Allowed helper-doc headings: ${canonicalHeadingOrder.join(", ")}.`,
                headingNode,
                "remark-lint:rule-doc-headings:unknown-heading"
            );
            continue;
        }

        if (headingOrder < lastOrder) {
            file.message(
                `Heading \`${headingName}\` is out of order. Follow the canonical helper-doc sequence.`,
                headingNode,
                "remark-lint:rule-doc-headings:order"
            );
        }

        lastOrder = headingOrder;
    }
};

/**
 * Validates that all required canonical H2 headings are present.
 *
 * @param {ReadonlyArray<{ heading: string }>} requiredCanonicalHeadings
 * @param {readonly string[]} headingNames
 * @param {VFile} file
 */
const checkRequiredH2Headings = (
    requiredCanonicalHeadings,
    headingNames,
    file
) => {
    for (const requiredHeading of requiredCanonicalHeadings) {
        if (!headingNames.includes(requiredHeading.heading)) {
            file.message(
                `Missing required H2 heading \`${requiredHeading.heading}\`.`,
                undefined,
                "remark-lint:rule-doc-headings:missing-required"
            );
        }
    }
};

/**
 * Validates the positional constraints of key H2 sections
 * (TargetedPatternScope, WhatThisRuleReports, PackageDocumentation,
 * FurtherReading).
 *
 * @param {readonly string[]} headingNames
 * @param {readonly Heading[]} h2Headings
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {boolean} requirePackageDocumentation
 * @param {VFile} file
 */
const checkSectionLayout = (
    headingNames,
    h2Headings,
    isHeadingEnabled,
    requirePackageDocumentation,
    file
) => {
    const targetedPatternScopeEnabled = isHeadingEnabled(
        "targetedPatternScope"
    );
    const whatThisRuleReportsEnabled = isHeadingEnabled("whatThisRuleReports");
    const packageDocumentationEnabled = isHeadingEnabled(
        "packageDocumentation"
    );
    const furtherReadingEnabled = isHeadingEnabled("furtherReading");

    const targetedPatternScopeIndex = headingNames.indexOf(
        "Targeted pattern scope"
    );
    const whatThisRuleReportsIndex = headingNames.indexOf(
        "What this rule reports"
    );
    const packageDocumentationIndex = headingNames.indexOf(
        "Package documentation"
    );
    const furtherReadingIndex = headingNames.indexOf("Further reading");

    /** @param {number} index */
    const getH2HeadingNodeAt = (index) =>
        index >= 0 && index < h2Headings.length ? h2Headings[index] : undefined;
    const firstH2HeadingNode = h2Headings[0];

    if (targetedPatternScopeEnabled && targetedPatternScopeIndex !== 0) {
        file.message(
            "`## Targeted pattern scope` must be the first H2 section.",
            getH2HeadingNodeAt(targetedPatternScopeIndex) ??
                getH2HeadingNodeAt(whatThisRuleReportsIndex) ??
                firstH2HeadingNode,
            "remark-lint:rule-doc-headings:targeted-scope-position"
        );
    }

    if (
        targetedPatternScopeEnabled &&
        whatThisRuleReportsEnabled &&
        whatThisRuleReportsIndex !== targetedPatternScopeIndex + 1
    ) {
        file.message(
            "`## What this rule reports` must immediately follow `## Targeted pattern scope`.",
            getH2HeadingNodeAt(whatThisRuleReportsIndex) ??
                getH2HeadingNodeAt(targetedPatternScopeIndex) ??
                firstH2HeadingNode,
            "remark-lint:rule-doc-headings:targeted-scope-adjacent"
        );
    }

    if (
        packageDocumentationEnabled &&
        requirePackageDocumentation &&
        packageDocumentationIndex === -1
    ) {
        file.message(
            "Missing required `## Package documentation` section.",
            undefined,
            "remark-lint:rule-doc-headings:missing-package-docs"
        );
    }

    if (furtherReadingEnabled && furtherReadingIndex === -1) {
        file.message(
            "Missing required `## Further reading` section.",
            undefined,
            "remark-lint:rule-doc-headings:missing-further-reading"
        );
    }

    if (
        packageDocumentationEnabled &&
        furtherReadingEnabled &&
        packageDocumentationIndex !== -1 &&
        furtherReadingIndex !== -1 &&
        packageDocumentationIndex !== furtherReadingIndex - 1
    ) {
        file.message(
            "`## Package documentation` must appear immediately before `## Further reading`.",
            h2Headings[packageDocumentationIndex],
            "remark-lint:rule-doc-headings:package-placement"
        );
    }

    return { packageDocumentationIndex, furtherReadingIndex };
};

/**
 * Validates the Deprecated section contains a replacement link.
 *
 * @param {readonly Heading[]} h2Headings
 * @param {number} deprecatedSectionIndex
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {VFile} file
 *
 * @returns {boolean} `true` if validation should stop after this check
 */
const checkDeprecatedSection = (
    h2Headings,
    deprecatedSectionIndex,
    isHeadingEnabled,
    file
) => {
    if (!isHeadingEnabled("deprecated") || deprecatedSectionIndex === -1) {
        return false;
    }

    const deprecatedSectionHeading = h2Headings[deprecatedSectionIndex];

    if (deprecatedSectionHeading === undefined) {
        return true;
    }

    const nextH2Heading = h2Headings[deprecatedSectionIndex + 1];
    const deprecatedSectionContent = getSectionContent(
        file,
        deprecatedSectionHeading,
        nextH2Heading
    );

    if (!/\[[^\]]+\]\([^)]+\)/u.test(deprecatedSectionContent)) {
        file.message(
            "`## Deprecated` should include a link to the recommended replacement rule or package.",
            deprecatedSectionHeading,
            "remark-lint:rule-doc-headings:deprecated-replacement-link"
        );
    }

    return false;
};

/**
 * Validates the Package documentation section contains a package-label line.
 *
 * @param {readonly Heading[]} h2Headings
 * @param {number} packageDocumentationIndex
 * @param {(key: string) => boolean} isHeadingEnabled
 * @param {boolean} requirePackageDocumentationLabel
 * @param {RegExp} packageDocumentationLabelPattern
 * @param {VFile} file
 */
const checkPackageDocLabel = (
    h2Headings,
    packageDocumentationIndex,
    isHeadingEnabled,
    requirePackageDocumentationLabel,
    packageDocumentationLabelPattern,
    file
) => {
    if (
        !isHeadingEnabled("packageDocumentation") ||
        !requirePackageDocumentationLabel ||
        packageDocumentationIndex === -1
    ) {
        return;
    }

    const packageDocumentationHeading = h2Headings[packageDocumentationIndex];

    if (packageDocumentationHeading === undefined) {
        return;
    }

    const nextPackageSectionHeading = h2Headings[packageDocumentationIndex + 1];
    const packageDocumentationContent = getSectionContent(
        file,
        packageDocumentationHeading,
        nextPackageSectionHeading
    );

    if (!packageDocumentationLabelPattern.test(packageDocumentationContent)) {
        file.message(
            "`## Package documentation` must include at least one `<package> package documentation:` label line.",
            packageDocumentationHeading,
            "remark-lint:rule-doc-headings:package-docs-label"
        );
    }
};

/**
 * Validates that exactly one rule catalog ID marker is present.
 *
 * @param {string} markdownContent
 * @param {RegExp} ruleCatalogIdLinePattern
 * @param {readonly Heading[]} h2Headings
 * @param {number} furtherReadingIndex
 * @param {VFile} file
 */
const checkRuleCatalogId = (
    markdownContent,
    ruleCatalogIdLinePattern,
    h2Headings,
    furtherReadingIndex,
    file
) => {
    const ruleCatalogIdLines = markdownContent
        .split(/\r?\n/u)
        .map((line) => line.trimEnd())
        .filter((line) => ruleCatalogIdLinePattern.test(line));

    /** @param {number} index */
    const getH2HeadingNodeAt = (index) =>
        index >= 0 && index < h2Headings.length ? h2Headings[index] : undefined;
    const fallbackNode =
        getH2HeadingNodeAt(furtherReadingIndex) ?? h2Headings[0];

    if (ruleCatalogIdLines.length === 0) {
        file.message(
            "Missing required rule catalog marker line `> **Rule catalog ID:** R###`.",
            fallbackNode,
            "remark-lint:rule-doc-headings:missing-rule-catalog-id"
        );
    }

    if (ruleCatalogIdLines.length > 1) {
        file.message(
            "Rule docs must contain exactly one `> **Rule catalog ID:** R###` marker line.",
            fallbackNode,
            "remark-lint:rule-doc-headings:duplicate-rule-catalog-id"
        );
    }
};

/**
 * Enforce canonical helper-doc heading schema.
 *
 * @param {RemarkLintRuleDocHeadingsOptions} [options]
 *
 * @returns {(tree: Node, file: VFile) => void}
 */
export default function remarkLintRuleDocHeadings(options = {}) {
    const headingToggles = {
        ...defaultHeadingToggles,
        ...options.headings,
    };
    const helperDocPathPattern =
        options.helperDocPathPattern ?? defaultHelperDocPathPattern;
    const requirePackageDocumentation =
        options.requirePackageDocumentation ?? false;
    const requirePackageDocumentationLabel =
        options.requirePackageDocumentationLabel ??
        options.packageDocumentationLabelPattern !== undefined;
    const packageDocumentationLabelPattern =
        options.packageDocumentationLabelPattern ??
        defaultPackageDocumentationLabelPattern;
    const ruleCatalogIdLinePattern =
        options.ruleCatalogIdLinePattern ?? defaultRuleCatalogIdLinePattern;
    /** @param {keyof typeof defaultHeadingToggles} headingKey */
    const isHeadingEnabled = (headingKey) =>
        headingToggles[headingKey] !== false;
    const enabledCanonicalHeadingOrder = canonicalHeadingDefinitions
        .filter((definition) => isHeadingEnabled(definition.key))
        .map((definition) => definition.heading);
    const headingOrderIndex = new Map(
        enabledCanonicalHeadingOrder.map((heading, index) => [heading, index])
    );
    const optionalDetailHeadings = new Set(
        optionalDetailHeadingDefinitions
            .filter((definition) => isHeadingEnabled(definition.key))
            .map((definition) => definition.heading)
    );
    const requiredCanonicalHeadings = canonicalHeadingDefinitions.filter(
        (definition) =>
            isHeadingEnabled(definition.key) && definition.requiredByDefault
    );

    return (tree, file) => {
        if (typeof file.path !== "string") {
            return;
        }

        if (!isRootNode(tree)) {
            return;
        }

        const normalizedPath = normalizePath(file.path);

        if (!helperDocPathPattern.test(normalizedPath)) {
            return;
        }

        const h1Headings = getHeadingsByDepth(tree, 1);
        const h2Headings = getHeadingsByDepth(tree, 2);
        const headingNames = h2Headings.map((heading) =>
            getNodeText(heading).trim()
        );

        const expectedRuleTitle = normalizedPath
            .split("/")
            .at(-1)
            ?.replace(/\.md$/u, "");
        const packageMetadata = getNearestPackageMetadata(file.path);
        const packageRuleNamespaceAliases = isPackageName(packageMetadata?.name)
            ? getRuleNamespaceAliasesFromPackageName(packageMetadata.name)
            : [];
        const ruleNamespaceAliases = [
            ...new Set([
                ...packageRuleNamespaceAliases,
                ...(options.ruleNamespaceAliases ?? []),
            ]),
        ];

        checkH1HeadingCount(h1Headings, file);
        checkH1HeadingTitle(
            h1Headings,
            expectedRuleTitle,
            ruleNamespaceAliases,
            file
        );
        checkDuplicateH2Headings(
            headingNames,
            h2Headings,
            isHeadingEnabled,
            file
        );
        checkDetailH3Headings(
            tree,
            optionalDetailHeadings,
            isHeadingEnabled,
            file
        );
        checkH2HeadingOrder(
            headingNames,
            h2Headings,
            isHeadingEnabled,
            headingOrderIndex,
            file
        );
        checkRequiredH2Headings(requiredCanonicalHeadings, headingNames, file);

        const deprecatedSectionIndex = headingNames.indexOf("Deprecated");
        const { packageDocumentationIndex, furtherReadingIndex } =
            checkSectionLayout(
                headingNames,
                h2Headings,
                isHeadingEnabled,
                requirePackageDocumentation,
                file
            );

        if (
            checkDeprecatedSection(
                h2Headings,
                deprecatedSectionIndex,
                isHeadingEnabled,
                file
            )
        ) {
            return;
        }

        checkPackageDocLabel(
            h2Headings,
            packageDocumentationIndex,
            isHeadingEnabled,
            requirePackageDocumentationLabel,
            packageDocumentationLabelPattern,
            file
        );

        checkRuleCatalogId(
            String(file),
            ruleCatalogIdLinePattern,
            h2Headings,
            furtherReadingIndex,
            file
        );
    };
}
