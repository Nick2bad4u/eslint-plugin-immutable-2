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
export const name = "no-cookie-mutation" as const;

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

/** CookieStore methods that mutate cookie state. */
const cookieStoreMutatorMethods: ReadonlySet<string> = new Set([
    "delete",
    "set",
] as const);

/** Host globals that expose `document` and `cookieStore`. */
const hostGlobals: ReadonlySet<string> = new Set([
    "globalThis",
    "self",
    "window",
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

/** `no-cookie-mutation` rule implementation. */
const noCookieMutationRule: ReturnType<typeof createRule<Options, MessageIds>> =
    createRule<Options, MessageIds>({
        create(context, [options]) {
            const cookieStoreVariables = new WeakSet<TSESLint.Scope.Variable>();
            const documentVariables = new WeakSet<TSESLint.Scope.Variable>();

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

            const isUnshadowedGlobal = (
                identifier: Readonly<TSESTree.Identifier>,
                expectedName: "cookieStore" | "document"
            ): boolean => {
                if (identifier.name !== expectedName) {
                    return false;
                }

                const variable = resolveVariable(identifier);
                return variable === null || variable.defs.length === 0;
            };

            const isDocumentExpression = (
                expression: Readonly<TSESTree.Expression>
            ): boolean => {
                const node = unwrapExpression(expression);

                if (isIdentifier(node)) {
                    const variable = resolveVariable(node);
                    if (variable !== null) {
                        return documentVariables.has(variable);
                    }

                    return isUnshadowedGlobal(node, "document");
                }

                if (!isMemberExpression(node) || node.object.type === "Super") {
                    return false;
                }

                const propertyName = getMemberPropertyName(node);
                return (
                    propertyName === "document" &&
                    isIdentifier(node.object) &&
                    hostGlobals.has(node.object.name)
                );
            };

            const isCookieStoreExpression = (
                expression: Readonly<TSESTree.Expression>
            ): boolean => {
                const node = unwrapExpression(expression);

                if (isIdentifier(node)) {
                    const variable = resolveVariable(node);
                    if (variable !== null) {
                        return cookieStoreVariables.has(variable);
                    }

                    return isUnshadowedGlobal(node, "cookieStore");
                }

                if (!isMemberExpression(node) || node.object.type === "Super") {
                    return false;
                }

                const propertyName = getMemberPropertyName(node);
                return (
                    propertyName === "cookieStore" &&
                    isIdentifier(node.object) &&
                    hostGlobals.has(node.object.name)
                );
            };

            const markVariableKinds = (
                identifier: Readonly<TSESTree.Identifier>,
                expression: null | Readonly<TSESTree.Expression>
            ): void => {
                const variable = resolveVariable(identifier);
                if (variable === null) {
                    return;
                }

                if (
                    expression !== null &&
                    isCookieStoreExpression(expression)
                ) {
                    cookieStoreVariables.add(variable);
                } else {
                    cookieStoreVariables.delete(variable);
                }

                if (expression !== null && isDocumentExpression(expression)) {
                    documentVariables.add(variable);
                } else {
                    documentVariables.delete(variable);
                }
            };

            const isDocumentCookieMember = (
                node: Readonly<TSESTree.MemberExpression>
            ): boolean => {
                if (node.object.type === "Super") {
                    return false;
                }

                return (
                    getMemberPropertyName(node) === "cookie" &&
                    isDocumentExpression(node.object)
                );
            };

            return {
                AssignmentExpression(node): void {
                    if (isIdentifier(node.left)) {
                        markVariableKinds(node.left, node.right);
                        return;
                    }

                    if (
                        shouldIgnore(node, context, options) ||
                        !isMemberExpression(node.left) ||
                        !isDocumentCookieMember(node.left)
                    ) {
                        return;
                    }

                    context.report({
                        messageId: "generic",
                        node,
                    });
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
                    if (!cookieStoreMutatorMethods.has(methodName)) {
                        return;
                    }

                    if (!isCookieStoreExpression(node.callee.object)) {
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
                        !isDocumentCookieMember(node.argument) ||
                        shouldIgnore(node.argument, context, options)
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
                        !isDocumentCookieMember(node.argument) ||
                        shouldIgnore(node.argument, context, options)
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

                    markVariableKinds(node.id, node.init);
                },
            };
        },
        meta: {
            defaultOptions: [{}],
            docs: {
                description:
                    "disallow mutating cookie state via document.cookie and CookieStore mutators.",
                recommended: true,
                url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cookie-mutation",
            },
            messages: {
                generic:
                    "Mutating cookie state is not allowed. Prefer immutable cookie/state transfer flows.",
            },
            schema: optionsSchema,
            type: "suggestion",
        },
        name,
    });

export default noCookieMutationRule;
