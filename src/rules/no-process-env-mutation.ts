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
import { isIdentifier, isMemberExpression } from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-process-env-mutation" as const;

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

/** Resolve string property key for a member expression when statically known. */
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

/** `no-process-env-mutation` rule implementation. */
const noProcessEnvMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const processEnvVariables = new WeakSet<TSESLint.Scope.Variable>();

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

        const isProcessEnvExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                return variable !== null && processEnvVariables.has(variable);
            }

            if (!isMemberExpression(node) || node.object.type === "Super") {
                return false;
            }

            const propertyName = getMemberPropertyName(node);
            return (
                propertyName === "env" &&
                isIdentifier(node.object) &&
                node.object.name === "process"
            );
        };

        const isProcessEnvMutationTarget = (
            memberExpression: Readonly<TSESTree.MemberExpression>
        ): boolean => {
            if (isProcessEnvExpression(memberExpression)) {
                return true;
            }

            if (memberExpression.object.type === "Super") {
                return false;
            }

            return isProcessEnvExpression(memberExpression.object);
        };

        const markProcessEnvVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isProcessEnvExpression(expression)) {
                processEnvVariables.add(variable);
                return;
            }

            processEnvVariables.delete(variable);
        };

        const reportMutation = (
            node:
                | Readonly<TSESTree.AssignmentExpression>
                | Readonly<TSESTree.UnaryExpression>
                | Readonly<TSESTree.UpdateExpression>
        ): void => {
            context.report({
                messageId: "generic",
                node,
            });
        };

        return {
            AssignmentExpression(node): void {
                if (isIdentifier(node.left)) {
                    markProcessEnvVariable(node.left, node.right);
                    return;
                }

                if (
                    shouldIgnore(node, context, options) ||
                    !isMemberExpression(node.left) ||
                    !isProcessEnvMutationTarget(node.left)
                ) {
                    return;
                }

                reportMutation(node);
            },
            UnaryExpression(node): void {
                if (
                    node.operator !== "delete" ||
                    !isMemberExpression(node.argument) ||
                    shouldIgnore(node.argument, context, options) ||
                    !isProcessEnvMutationTarget(node.argument)
                ) {
                    return;
                }

                reportMutation(node);
            },
            UpdateExpression(node): void {
                if (
                    !isMemberExpression(node.argument) ||
                    shouldIgnore(node.argument, context, options) ||
                    !isProcessEnvMutationTarget(node.argument)
                ) {
                    return;
                }

                reportMutation(node);
            },
            VariableDeclarator(node): void {
                if (!isIdentifier(node.id)) {
                    return;
                }

                markProcessEnvVariable(node.id, node.init);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "disallow mutating process.env and process.env aliases.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-process-env-mutation",
        },
        messages: {
            generic:
                "Mutating `process.env` is not allowed. Derive a new environment object instead.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noProcessEnvMutationRule;
