import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import escapeRegExp from "escape-string-regexp";

import type { BaseOptions, RuleContext } from "../util/rule.js";

import { inClass, inFunction, inInterface } from "../util/tree.js";
import {
    isAssignmentExpression,
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    isTSPropertySignature,
    isTypeAliasDeclaration,
    isVariableDeclaration,
    isVariableDeclarator,
} from "../util/typeguard.js";

/** All reusable ignore options used across immutable rules. */
export type AllIgnoreOptions = IgnoreAccessorPatternOption &
    IgnoreClassOption &
    IgnoreInterfaceOption &
    IgnoreLocalOption &
    IgnorePatternOption;

/** Option to ignore by accessor glob-like pattern(s). */
export type IgnoreAccessorPatternOption = {
    readonly ignoreAccessorPattern?: readonly string[] | string;
};

/** Option to ignore nodes that appear in class scopes. */
export type IgnoreClassOption = {
    readonly ignoreClass?: boolean;
};

/** Option to ignore nodes that appear in interface scopes. */
export type IgnoreInterfaceOption = {
    readonly ignoreInterface?: boolean;
};

/** Option to ignore local (function-scoped) nodes. */
export type IgnoreLocalOption = {
    readonly ignoreLocal?: boolean;
};

/** Option to ignore by identifier/member-access regex pattern(s). */
export type IgnorePatternOption = {
    readonly ignorePattern?: readonly string[] | string;
};

/** Option to ignore return-type positions. */
export type IgnoreReturnTypeOption = {
    readonly ignoreReturnType?: boolean;
};

/** Shared JSON schema property for `ignoreLocal`. */
export const ignoreLocalSchemaProperty: Readonly<
    Record<string, JSONSchema4>
> = {
    ignoreLocal: {
        type: "boolean",
    },
};

/** Shared JSON schema property for `ignorePattern`. */
export const ignorePatternSchemaProperty: Readonly<
    Record<string, JSONSchema4>
> = {
    ignorePattern: {
        items: {
            type: "string",
        },
        type: ["array", "string"],
    },
};

/** Shared JSON schema property for `ignoreAccessorPattern`. */
export const ignoreAccessorPatternSchemaProperty: Readonly<
    Record<string, JSONSchema4>
> = {
    ignoreAccessorPattern: {
        items: {
            type: "string",
        },
        type: ["array", "string"],
    },
};

/** Shared JSON schema property for `ignoreClass`. */
export const ignoreClassSchemaProperty: Readonly<
    Record<string, JSONSchema4>
> = {
    ignoreClass: {
        type: "boolean",
    },
};

/** Shared JSON schema property for `ignoreInterface`. */
export const ignoreInterfaceSchemaProperty: Readonly<
    Record<string, JSONSchema4>
> = {
    ignoreInterface: {
        type: "boolean",
    },
};

/** Shared JSON schema property for `ignoreReturnType`. */
export const ignoreReturnTypeSchemaProperty: Readonly<
    Record<string, JSONSchema4>
> = {
    ignoreReturnType: {
        type: "boolean",
    },
};

/**
 * Normalize a string-or-array pattern option into a readonly array.
 */
const normalizePatterns = (
    patterns: readonly string[] | string
): readonly string[] => {
    if (typeof patterns === "string") {
        return [patterns];
    }

    return [...patterns];
};

/**
 * Safely test a regex pattern string against text.
 */
const safelyMatchesRegexPattern = (pattern: string, text: string): boolean => {
    try {
        return new RegExp(pattern, "u").test(text);
    } catch {
        return false;
    }
};

/**
 * Match dotted accessor text (e.g. `foo.bar.baz`) against glob-like patterns.
 */
const matchesAccessorPattern = (
    text: string,
    accessorPattern: readonly string[] | string
): boolean => {
    const patterns = normalizePatterns(accessorPattern);
    const textParts = text.split(".");

    const findMatch = (
        patternParts: readonly string[],
        remainingTextParts: readonly string[],
        allowExtra = false
    ): boolean => {
        const [currentPatternPart, ...restPatternParts] = patternParts;

        if (currentPatternPart === undefined) {
            return allowExtra || remainingTextParts.length === 0;
        }

        if (currentPatternPart === "**") {
            if (remainingTextParts.length === 0) {
                return findMatch(restPatternParts, [], allowExtra);
            }

            for (
                let offset = 0;
                offset <= remainingTextParts.length;
                offset += 1
            ) {
                if (
                    findMatch(
                        restPatternParts,
                        remainingTextParts.slice(offset),
                        true
                    )
                ) {
                    return true;
                }
            }

            return false;
        }

        if (currentPatternPart === "*") {
            return (
                remainingTextParts.length > 0 &&
                findMatch(
                    restPatternParts,
                    remainingTextParts.slice(1),
                    allowExtra
                )
            );
        }

        const currentTextPart = remainingTextParts[0];
        if (currentTextPart === undefined) {
            return false;
        }

        const segmentRegex = new RegExp(
            `^${escapeRegExp(currentPatternPart).replaceAll(String.raw`\*`, ".*")}$`,
            "u"
        );

        return (
            segmentRegex.test(currentTextPart) &&
            findMatch(restPatternParts, remainingTextParts.slice(1), allowExtra)
        );
    };

    return patterns.some((pattern) => findMatch(pattern.split("."), textParts));
};

/**
 * Resolve a stable text form for pattern matching from a node.
 */
const getSingleNodeText = (
    node: TSESTree.Node,
    context: RuleContext<string, BaseOptions>
): string | undefined => {
    if (isAssignmentExpression(node)) {
        return getSingleNodeText(node.left, context);
    }

    if (isCallExpression(node)) {
        return getSingleNodeText(node.callee, context);
    }

    if (isMemberExpression(node)) {
        return getNormalizedNodeText(node.object, context);
    }

    if (isVariableDeclarator(node) || isTypeAliasDeclaration(node)) {
        return getNormalizedNodeText(node.id, context);
    }

    if (isTSPropertySignature(node)) {
        return getNormalizedNodeText(node.key, context);
    }

    return getNormalizedNodeText(node, context);
};

/**
 * Render node text with special handling for identifiers/member access chains.
 */
const getNormalizedNodeText = (
    node: TSESTree.Node,
    context: RuleContext<string, BaseOptions>
): string => {
    if (isIdentifier(node)) {
        return node.name;
    }

    if (isMemberExpression(node)) {
        return `${getNormalizedNodeText(node.object, context)}.${getNormalizedNodeText(node.property, context)}`;
    }

    return context.sourceCode.getText(node);
};

/**
 * Resolve node texts used for ignore-pattern/accessor matching.
 */
const getNodeTexts = (
    node: TSESTree.Node,
    context: RuleContext<string, BaseOptions>
): readonly string[] => {
    if (isVariableDeclaration(node)) {
        return node.declarations
            .map((declaration) => getSingleNodeText(declaration, context))
            .filter((text): text is string => typeof text === "string");
    }

    const text = getSingleNodeText(node, context);
    return typeof text === "string" ? [text] : [];
};

/**
 * Check whether a node should be ignored according to configured ignore options.
 */
export const shouldIgnore = (
    node: TSESTree.Node,
    context: RuleContext<string, BaseOptions>,
    ignoreOptions: AllIgnoreOptions
): boolean => {
    if (ignoreOptions.ignoreLocal === true && inFunction(node)) {
        return true;
    }

    if (ignoreOptions.ignoreClass === true && inClass(node)) {
        return true;
    }

    if (ignoreOptions.ignoreInterface === true && inInterface(node)) {
        return true;
    }

    const nodeTexts = getNodeTexts(node, context);
    if (nodeTexts.length === 0) {
        return false;
    }

    if (ignoreOptions.ignorePattern !== undefined) {
        const patterns = normalizePatterns(ignoreOptions.ignorePattern);
        const allTextsMatchPattern = nodeTexts.every((text) =>
            patterns.some((pattern) => safelyMatchesRegexPattern(pattern, text))
        );

        if (allTextsMatchPattern) {
            return true;
        }
    }

    if (ignoreOptions.ignoreAccessorPattern !== undefined) {
        const allTextsMatchAccessorPattern = nodeTexts.every((text) =>
            matchesAccessorPattern(text, ignoreOptions.ignoreAccessorPattern!)
        );

        if (allTextsMatchAccessorPattern) {
            return true;
        }
    }

    return false;
};
