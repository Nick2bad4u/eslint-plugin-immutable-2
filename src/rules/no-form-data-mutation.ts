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
export const name = "no-form-data-mutation" as const;

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

/** FormData methods that mutate the current instance in place. */
const formDataMutatorMethods: ReadonlySet<string> = new Set([
    "append",
    "delete",
    "set",
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

/** `no-form-data-mutation` rule implementation. */
const noFormDataMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const formDataVariables = new WeakSet<TSESLint.Scope.Variable>();

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

        const isFormDataExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isNewExpression(node) && isIdentifier(node.callee)) {
                return node.callee.name === "FormData";
            }

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                return variable !== null && formDataVariables.has(variable);
            }

            return false;
        };

        const markFormDataVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isFormDataExpression(expression)) {
                formDataVariables.add(variable);
                return;
            }

            formDataVariables.delete(variable);
        };

        return {
            AssignmentExpression(node): void {
                if (!isIdentifier(node.left)) {
                    return;
                }

                markFormDataVariable(node.left, node.right);
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
                if (!formDataMutatorMethods.has(methodName)) {
                    return;
                }

                if (!isFormDataExpression(node.callee.object)) {
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

                markFormDataVariable(node.id, node.init);
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            description: "disallow mutating FormData instances after creation.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-form-data-mutation",
        },
        messages: {
            generic:
                "Mutating FormData instances with `{{methodName}}` is not allowed. Create a new FormData value instead.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noFormDataMutationRule;
