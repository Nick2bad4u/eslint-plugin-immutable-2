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
export const name = "no-url-mutation" as const;

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

/** URL instance properties that mutate URL state when assigned/deleted/updated. */
const urlMutatingProperties: ReadonlySet<string> = new Set([
    "hash",
    "host",
    "hostname",
    "href",
    "password",
    "pathname",
    "port",
    "protocol",
    "search",
    "username",
] as const);

/** URLSearchParams mutator methods when reached via `url.searchParams`. */
const searchParamsMutatorMethods: ReadonlySet<string> = new Set([
    "append",
    "delete",
    "set",
    "sort",
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

/** `no-url-mutation` rule implementation. */
const noUrlMutationRule: ReturnType<typeof createRule<Options, MessageIds>> =
    createRule<Options, MessageIds>({
        create(context, [options]) {
            const urlVariables = new WeakSet<TSESLint.Scope.Variable>();

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

            const isUrlExpression = (
                expression: Readonly<TSESTree.Expression>
            ): boolean => {
                const node = unwrapExpression(expression);

                if (isNewExpression(node) && isIdentifier(node.callee)) {
                    return node.callee.name === "URL";
                }

                if (isIdentifier(node)) {
                    const variable = resolveVariable(node);
                    return variable !== null && urlVariables.has(variable);
                }

                return false;
            };

            const isUrlSearchParamsMemberExpression = (
                expression: Readonly<TSESTree.Expression>
            ): boolean => {
                const node = unwrapExpression(expression);
                if (!isMemberExpression(node) || node.object.type === "Super") {
                    return false;
                }

                return (
                    getMemberPropertyName(node) === "searchParams" &&
                    isUrlExpression(node.object)
                );
            };

            const markUrlVariable = (
                identifier: Readonly<TSESTree.Identifier>,
                expression: null | Readonly<TSESTree.Expression>
            ): void => {
                const variable = resolveVariable(identifier);
                if (variable === null) {
                    return;
                }

                if (expression !== null && isUrlExpression(expression)) {
                    urlVariables.add(variable);
                    return;
                }

                urlVariables.delete(variable);
            };

            const reportMutation = (
                node:
                    | Readonly<TSESTree.AssignmentExpression>
                    | Readonly<TSESTree.CallExpression>
                    | Readonly<TSESTree.UnaryExpression>
                    | Readonly<TSESTree.UpdateExpression>,
                mutation: string
            ): void => {
                context.report({
                    data: {
                        mutation,
                    },
                    messageId: "generic",
                    node,
                });
            };

            return {
                AssignmentExpression(node): void {
                    if (isIdentifier(node.left)) {
                        markUrlVariable(node.left, node.right);
                        return;
                    }

                    if (
                        shouldIgnore(node, context, options) ||
                        !isMemberExpression(node.left) ||
                        node.left.object.type === "Super"
                    ) {
                        return;
                    }

                    const propertyName = getMemberPropertyName(node.left);
                    if (
                        propertyName === null ||
                        !urlMutatingProperties.has(propertyName) ||
                        !isUrlExpression(node.left.object)
                    ) {
                        return;
                    }

                    reportMutation(node, propertyName);
                },
                CallExpression(node): void {
                    if (
                        shouldIgnore(node, context, options) ||
                        !isMemberExpression(node.callee) ||
                        node.callee.object.type === "Super" ||
                        !isIdentifier(node.callee.property)
                    ) {
                        return;
                    }

                    const methodName = node.callee.property.name;
                    if (!searchParamsMutatorMethods.has(methodName)) {
                        return;
                    }

                    if (
                        !isUrlSearchParamsMemberExpression(node.callee.object)
                    ) {
                        return;
                    }

                    reportMutation(node, `searchParams.${methodName}`);
                },
                UnaryExpression(node): void {
                    if (
                        node.operator !== "delete" ||
                        !isMemberExpression(node.argument)
                    ) {
                        return;
                    }

                    if (
                        shouldIgnore(node.argument, context, options) ||
                        node.argument.object.type === "Super"
                    ) {
                        return;
                    }

                    const propertyName = getMemberPropertyName(node.argument);
                    if (
                        propertyName === null ||
                        !urlMutatingProperties.has(propertyName) ||
                        !isUrlExpression(node.argument.object)
                    ) {
                        return;
                    }

                    reportMutation(node, propertyName);
                },
                UpdateExpression(node): void {
                    if (!isMemberExpression(node.argument)) {
                        return;
                    }

                    if (
                        shouldIgnore(node.argument, context, options) ||
                        node.argument.object.type === "Super"
                    ) {
                        return;
                    }

                    const propertyName = getMemberPropertyName(node.argument);
                    if (
                        propertyName === null ||
                        !urlMutatingProperties.has(propertyName) ||
                        !isUrlExpression(node.argument.object)
                    ) {
                        return;
                    }

                    reportMutation(node, propertyName);
                },
                VariableDeclarator(node): void {
                    if (!isIdentifier(node.id)) {
                        return;
                    }

                    markUrlVariable(node.id, node.init);
                },
            };
        },
        defaultOptions,
        meta: {
            defaultOptions: [{}],
            docs: {
                description:
                    "disallow mutating URL instances and URL.searchParams mutator calls.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-mutation",
            },
            messages: {
                generic:
                    "Mutating URL instances via `{{mutation}}` is not allowed. Create a new URL value instead.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default noUrlMutationRule;
