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
export const name = "no-data-view-mutation" as const;

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

/** DataView methods that mutate the underlying buffer. */
const dataViewMutatorMethods: ReadonlySet<string> = new Set([
    "setBigInt64",
    "setBigUint64",
    "setFloat32",
    "setFloat64",
    "setInt16",
    "setInt32",
    "setInt8",
    "setUint16",
    "setUint32",
    "setUint8",
] as const);

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

/** `no-data-view-mutation` rule implementation. */
const noDataViewMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const dataViewVariables = new WeakSet<TSESLint.Scope.Variable>();

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

        const isDataViewExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isNewExpression(node) && isIdentifier(node.callee)) {
                return node.callee.name === "DataView";
            }

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                return variable !== null && dataViewVariables.has(variable);
            }

            return false;
        };

        const markDataViewVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isDataViewExpression(expression)) {
                dataViewVariables.add(variable);
                return;
            }

            dataViewVariables.delete(variable);
        };

        return {
            AssignmentExpression(node): void {
                if (!isIdentifier(node.left)) {
                    return;
                }

                markDataViewVariable(node.left, node.right);
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
                if (!dataViewMutatorMethods.has(methodName)) {
                    return;
                }

                if (!isDataViewExpression(node.callee.object)) {
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

                markDataViewVariable(node.id, node.init);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description: "disallow mutating DataView instances after creation.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-data-view-mutation",
        },
        messages: {
            generic:
                "Mutating DataView instances with `{{methodName}}` is not allowed. Create a new DataView value instead.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noDataViewMutationRule;
