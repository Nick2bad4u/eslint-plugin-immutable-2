import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import {
    type IgnoreLocalOption,
    ignoreLocalSchemaProperty,
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    type IgnoreReturnTypeOption,
    ignoreReturnTypeSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import { createRule, getTypeOfNode } from "../util/rule.js";
import { isInReturnType } from "../util/tree.js";
import {
    isArrayType,
    isAssignmentPattern,
    isIdentifier,
    isTSArrayType,
    isTSTypeOperator,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "readonly-array" as const;

type Options = readonly [
    IgnoreLocalOption & IgnorePatternOption & IgnoreReturnTypeOption,
];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            ...ignoreLocalSchemaProperty,
            ...ignorePatternSchemaProperty,
            ...ignoreReturnTypeSchemaProperty,
        },
        type: "object",
    },
];

type ImplicitCandidate = {
    readonly id: TSESTree.Node;
    readonly init: null | TSESTree.Node;
    readonly reportNode: TSESTree.Node;
};

const getImplicitCandidates = (
    node: Readonly<
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.VariableDeclaration
    >
): readonly ImplicitCandidate[] => {
    if (node.type === "VariableDeclaration") {
        return node.declarations.map((declaration) => ({
            id: declaration.id,
            init: declaration.init,
            reportNode: declaration,
        }));
    }

    const candidates: ImplicitCandidate[] = [];
    for (const parameter of node.params) {
        if (!isAssignmentPattern(parameter)) {
            continue;
        }

        candidates.push({
            id: parameter.left,
            init: parameter.right,
            reportNode: parameter,
        });
    }

    return candidates;
};

/** `readonly-array` rule implementation. */
const readonlyArrayRule: ReturnType<
    typeof createRule<Options, "generic" | "implicit">
> = createRule<Options, "generic" | "implicit">({
    create(context, [options]) {
        const checkArrayOrTupleType = (
            node: Readonly<TSESTree.TSArrayType | TSESTree.TSTupleType>
        ): void => {
            if (shouldIgnore(node, context, options)) {
                return;
            }

            if (
                node.parent !== undefined &&
                isTSTypeOperator(node.parent) &&
                node.parent.operator === "readonly"
            ) {
                return;
            }

            if (options.ignoreReturnType === true && isInReturnType(node)) {
                return;
            }

            context.report({
                fix: (fixer): readonly TSESLint.RuleFix[] => {
                    if (
                        node.parent !== undefined &&
                        isTSArrayType(node.parent)
                    ) {
                        return [
                            fixer.insertTextBefore(node, "(readonly "),
                            fixer.insertTextAfter(node, ")"),
                        ];
                    }

                    return [fixer.insertTextBefore(node, "readonly ")];
                },
                messageId: "generic",
                node,
            });
        };

        const checkTypeReference = (
            node: Readonly<TSESTree.TSTypeReference>
        ): void => {
            if (shouldIgnore(node, context, options)) {
                return;
            }

            if (
                !isIdentifier(node.typeName) ||
                node.typeName.name !== "Array"
            ) {
                return;
            }

            if (options.ignoreReturnType === true && isInReturnType(node)) {
                return;
            }

            context.report({
                fix: (fixer) => fixer.insertTextBefore(node, "Readonly"),
                messageId: "generic",
                node,
            });
        };

        const checkImplicitType = (
            node: Readonly<
                | TSESTree.ArrowFunctionExpression
                | TSESTree.FunctionDeclaration
                | TSESTree.FunctionExpression
                | TSESTree.VariableDeclaration
            >
        ): void => {
            if (shouldIgnore(node, context, options)) {
                return;
            }

            const candidates = getImplicitCandidates(node);
            for (const candidate of candidates) {
                if (!isIdentifier(candidate.id)) {
                    continue;
                }

                if (
                    candidate.id.typeAnnotation !== undefined ||
                    candidate.init === null
                ) {
                    continue;
                }

                if (!isArrayType(getTypeOfNode(candidate.init, context))) {
                    continue;
                }

                context.report({
                    fix: (fixer) =>
                        fixer.insertTextAfter(
                            candidate.id,
                            ": readonly unknown[]"
                        ),
                    messageId: "implicit",
                    node: candidate.reportNode,
                });
            }
        };

        return {
            ArrowFunctionExpression: checkImplicitType,
            FunctionDeclaration: checkImplicitType,
            FunctionExpression: checkImplicitType,
            TSArrayType: checkArrayOrTupleType,
            TSTupleType: checkArrayOrTupleType,
            TSTypeReference: checkTypeReference,
            VariableDeclaration: checkImplicitType,
        };
    },
    meta: {
        defaultOptions: [
            {
                ignoreLocal: false,
                ignoreReturnType: false,
            },
        ],
        docs: {
            description: "require readonly arrays over mutable arrays.",
            recommended: false,
            requiresTypeChecking: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-array",
        },
        fixable: "code",
        messages: {
            generic: "Only readonly arrays allowed.",
            implicit:
                "This variable is implicitly mutable array-typed. Add an explicit readonly array annotation.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default readonlyArrayRule;
