import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import {
    type IgnoreAccessorPatternOption,
    ignoreAccessorPatternSchemaProperty,
    type IgnorePatternOption,
    ignorePatternSchemaProperty,
    shouldIgnore,
} from "../common/ignore-options.js";
import { createRule } from "../util/rule.js";
import {
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    isNewExpression,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-regexp-lastindex-mutation" as const;

type MessageIds = "generic";
type Options = readonly [IgnoreAccessorPatternOption & IgnorePatternOption];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            ...ignoreAccessorPatternSchemaProperty,
            ...ignorePatternSchemaProperty,
        },
        type: "object",
    },
];

const defaultOptions: Options = [{}];

const unwrapExpression = (
    node: Readonly<TSESTree.Expression>
): Readonly<TSESTree.Expression> => {
    if (node.type === "ChainExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSAsExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSNonNullExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSSatisfiesExpression") {
        return unwrapExpression(node.expression);
    }

    if (node.type === "TSTypeAssertion") {
        return unwrapExpression(node.expression);
    }

    return node;
};

/** Resolve static string member property name where possible. */
const getMemberPropertyName = (
    memberExpression: Readonly<TSESTree.MemberExpression>
): null | string => {
    if (!memberExpression.computed && isIdentifier(memberExpression.property)) {
        return memberExpression.property.name;
    }

    if (
        memberExpression.computed &&
        memberExpression.property.type === "Literal" &&
        typeof memberExpression.property.value === "string"
    ) {
        return memberExpression.property.value;
    }

    return null;
};

/** `no-regexp-lastindex-mutation` rule implementation. */
const noRegexpLastIndexMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const regexpVariables = new WeakSet<TSESLint.Scope.Variable>();

        const resolveVariable = (
            identifier: Readonly<TSESTree.Identifier>
        ): null | TSESLint.Scope.Variable => {
            let scope: null | TSESLint.Scope.Scope =
                context.sourceCode.getScope(identifier);

            while (scope !== null) {
                const variable = scope.set.get(identifier.name);
                if (variable !== undefined) {
                    return variable;
                }

                scope = scope.upper;
            }

            return null;
        };

        const isUnshadowedRegExpGlobal = (
            identifier: Readonly<TSESTree.Identifier>
        ): boolean => {
            if (identifier.name !== "RegExp") {
                return false;
            }

            const variable = resolveVariable(identifier);
            return variable === null || variable.defs.length === 0;
        };

        const isRegExpConstructorCall = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isCallExpression(node) || isNewExpression(node)) {
                return (
                    isIdentifier(node.callee) &&
                    isUnshadowedRegExpGlobal(node.callee)
                );
            }

            return false;
        };

        const isRegExpLiteralExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);
            return node.type === "Literal" && "regex" in node;
        };

        const isRegExpExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                return variable !== null && regexpVariables.has(variable);
            }

            if (isRegExpLiteralExpression(node)) {
                return true;
            }

            return isRegExpConstructorCall(node);
        };

        const markRegexpVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isRegExpExpression(expression)) {
                regexpVariables.add(variable);
                return;
            }

            regexpVariables.delete(variable);
        };

        const isRegexpLastIndexMember = (
            memberExpression: Readonly<TSESTree.MemberExpression>
        ): boolean => {
            if (memberExpression.object.type === "Super") {
                return false;
            }

            return (
                getMemberPropertyName(memberExpression) === "lastIndex" &&
                isRegExpExpression(memberExpression.object)
            );
        };

        return {
            AssignmentExpression(node): void {
                if (isIdentifier(node.left)) {
                    markRegexpVariable(node.left, node.right);
                    return;
                }

                if (
                    shouldIgnore(node, context, options) ||
                    !isMemberExpression(node.left) ||
                    !isRegexpLastIndexMember(node.left)
                ) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            },
            UnaryExpression(node): void {
                if (
                    node.operator !== "delete" ||
                    !isMemberExpression(node.argument) ||
                    shouldIgnore(node.argument, context, options) ||
                    !isRegexpLastIndexMember(node.argument)
                ) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            },
            UpdateExpression(node): void {
                if (
                    !isMemberExpression(node.argument) ||
                    shouldIgnore(node.argument, context, options) ||
                    !isRegexpLastIndexMember(node.argument)
                ) {
                    return;
                }

                context.report({
                    messageId: "generic",
                    node,
                });
            },
            VariableDeclarator(node): void {
                if (!isIdentifier(node.id)) {
                    return;
                }

                markRegexpVariable(node.id, node.init);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "disallow mutating `RegExp#lastIndex` on regex instances.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-regexp-lastindex-mutation",
        },
        messages: {
            generic:
                "Mutating `RegExp#lastIndex` is not allowed. Prefer immutable regex usage patterns.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noRegexpLastIndexMutationRule;
