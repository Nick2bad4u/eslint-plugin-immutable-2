import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import { arrayFirst, isDefined, isEmpty, stringSplit } from "ts-extras";

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
export const ignoreLocalSchemaProperty: Readonly<Record<string, JSONSchema4>> =
    {
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
export const ignoreClassSchemaProperty: Readonly<Record<string, JSONSchema4>> =
    {
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

/** Escape regex metacharacters so user text can be matched literally. */
const escapeRegExp = (value: string): string =>
    value.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`);

/**
 * Safely test a regex pattern string against text.
 */
const safelyMatchesRegexPattern = (pattern: string, text: string): boolean => {
    try {
        // eslint-disable-next-line security/detect-non-literal-regexp -- user-supplied ignore patterns are intentionally compiled and guarded by try/catch.
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
    const textParts = stringSplit(text, ".");

    const findMatch = (
        patternParts: readonly string[],
        remainingTextParts: readonly string[],
        allowExtra = false
    ): boolean => {
        const [currentPatternPart, ...restPatternParts] = patternParts;

        if (!isDefined(currentPatternPart)) {
            return allowExtra || isEmpty(remainingTextParts);
        }

        if (currentPatternPart === "**") {
            if (isEmpty(remainingTextParts)) {
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

        const currentTextPart = arrayFirst(remainingTextParts);
        if (!isDefined(currentTextPart)) {
            return false;
        }

        const escapedAsterisk = String.raw`\*`;
        const escapedSegment = escapeRegExp(currentPatternPart).replaceAll(
            escapedAsterisk,
            ".*"
        );
        const segmentRegexSource = `^${escapedSegment}$`;
        // eslint-disable-next-line security/detect-non-literal-regexp -- glob fragments are escaped before wildcard expansion.
        const segmentRegex = new RegExp(segmentRegexSource, "u");

        return (
            segmentRegex.test(currentTextPart) &&
            findMatch(restPatternParts, remainingTextParts.slice(1), allowExtra)
        );
    };

    return patterns.some((pattern) =>
        findMatch(stringSplit(pattern, "."), textParts)
    );
};

/**
 * Resolve a stable text form for pattern matching from a node.
 */
const getNormalizedNodeText = (
    node: Readonly<TSESTree.Node>,
    context: Readonly<RuleContext<string, BaseOptions>>
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
 * Resolve a stable text form for pattern matching from a node.
 */
const getSingleNodeText = (
    node: Readonly<TSESTree.Node>,
    context: Readonly<RuleContext<string, BaseOptions>>
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
 * Resolve node texts used for ignore-pattern/accessor matching.
 */
const getNodeTexts = (
    node: Readonly<TSESTree.Node>,
    context: Readonly<RuleContext<string, BaseOptions>>
): readonly string[] => {
    if (isVariableDeclaration(node)) {
        return node.declarations.flatMap((declaration) => {
            const declarationText = getSingleNodeText(declaration, context);

            return typeof declarationText === "string" ? [declarationText] : [];
        });
    }

    const text = getSingleNodeText(node, context);
    return typeof text === "string" ? [text] : [];
};

/**
 * Check whether a node should be ignored according to configured ignore
 * options.
 */
export const shouldIgnore = (
    node: Readonly<TSESTree.Node>,
    context: Readonly<RuleContext<string, BaseOptions>>,
    ignoreOptions: Readonly<AllIgnoreOptions>
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
    if (isEmpty(nodeTexts)) {
        return false;
    }

    if (isDefined(ignoreOptions.ignorePattern)) {
        const patterns = normalizePatterns(ignoreOptions.ignorePattern);
        const allTextsMatchPattern = nodeTexts.every((text) =>
            patterns.some((pattern) => safelyMatchesRegexPattern(pattern, text))
        );

        if (allTextsMatchPattern) {
            return true;
        }
    }

    if (isDefined(ignoreOptions.ignoreAccessorPattern)) {
        const accessorPattern = ignoreOptions.ignoreAccessorPattern;
        const allTextsMatchAccessorPattern = nodeTexts.every((text) =>
            matchesAccessorPattern(text, accessorPattern)
        );

        if (allTextsMatchAccessorPattern) {
            return true;
        }
    }

    return false;
};
