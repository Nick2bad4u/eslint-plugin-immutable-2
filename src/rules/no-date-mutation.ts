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
    isIdentifier,
    isMemberExpression,
    isNewExpression,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-date-mutation" as const;

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

/** Date instance methods that mutate the current Date object in place. */
const dateMutatorMethods = new Set<string>([
    "setDate",
    "setFullYear",
    "setHours",
    "setMilliseconds",
    "setMinutes",
    "setMonth",
    "setSeconds",
    "setTime",
    "setUTCDate",
    "setUTCFullYear",
    "setUTCHours",
    "setUTCMilliseconds",
    "setUTCMinutes",
    "setUTCMonth",
    "setUTCSeconds",
    "setYear",
]);

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

/** `no-date-mutation` rule implementation. */
const noDateMutationRule: ReturnType<typeof createRule<Options, MessageIds>> =
    createRule<Options, MessageIds>({
        create(context, [options]) {
            const dateVariables = new WeakSet<TSESLint.Scope.Variable>();

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

            const isDateExpression = (
                expression: Readonly<TSESTree.Expression>
            ): boolean => {
                const node = unwrapExpression(expression);

                if (isNewExpression(node) && isIdentifier(node.callee)) {
                    return node.callee.name === "Date";
                }

                if (isIdentifier(node)) {
                    const variable = resolveVariable(node);
                    return variable !== null && dateVariables.has(variable);
                }

                return false;
            };

            const markDateVariable = (
                identifier: Readonly<TSESTree.Identifier>,
                expression: null | Readonly<TSESTree.Expression>
            ): void => {
                const variable = resolveVariable(identifier);
                if (variable === null) {
                    return;
                }

                if (expression !== null && isDateExpression(expression)) {
                    dateVariables.add(variable);
                    return;
                }

                dateVariables.delete(variable);
            };

            return {
                AssignmentExpression(node): void {
                    if (!isIdentifier(node.left)) {
                        return;
                    }

                    markDateVariable(node.left, node.right);
                },
                CallExpression(node): void {
                    if (shouldIgnore(node, context, options)) {
                        return;
                    }

                    if (
                        !isMemberExpression(node.callee) ||
                        node.callee.object.type === "Super" ||
                        !isIdentifier(node.callee.property)
                    ) {
                        return;
                    }

                    const methodName = node.callee.property.name;
                    if (!dateMutatorMethods.has(methodName)) {
                        return;
                    }

                    if (!isDateExpression(node.callee.object)) {
                        return;
                    }

                    context.report({
                        data: {
                            methodName,
                        },
                        messageId: "generic",
                        node,
                    });
                },
                VariableDeclarator(node): void {
                    if (!isIdentifier(node.id)) {
                        return;
                    }

                    markDateVariable(node.id, node.init);
                },
            };
        },
        meta: {
            defaultOptions: [{}],
            docs: {
                description:
                    "disallow mutating Date instances with in-place setter methods.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-date-mutation",
            },
            messages: {
                generic:
                    "Mutating Date instances with `{{methodName}}` is not allowed. Create a new Date value instead.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default noDateMutationRule;
