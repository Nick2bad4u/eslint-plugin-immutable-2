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
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-cache-api-mutation" as const;

type CacheTargetKind = "Cache" | "CacheStorage";
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

/** Methods on Cache instances that mutate cache entries. */
const cacheMutatorMethods: ReadonlySet<string> = new Set([
    "add",
    "addAll",
    "delete",
    "put",
] as const);

/** Methods on CacheStorage instances that mutate cache namespace state. */
const cacheStorageMutatorMethods: ReadonlySet<string> = new Set([
    "delete",
] as const);

/** Global hosts that expose `caches`. */
const cacheHostGlobals: ReadonlySet<string> = new Set([
    "globalThis",
    "self",
    "window",
] as const);

const unwrapExpression = (
    node: Readonly<TSESTree.Expression>
): Readonly<TSESTree.Expression> => {
    if (node.type === "AwaitExpression") {
        return unwrapExpression(node.argument);
    }

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

/** `no-cache-api-mutation` rule implementation. */
const noCacheApiMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const cacheVariables = new WeakSet<TSESLint.Scope.Variable>();
        const cacheStorageVariables = new WeakSet<TSESLint.Scope.Variable>();

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

        const isUnshadowedCachesGlobal = (
            identifier: Readonly<TSESTree.Identifier>
        ): boolean => {
            if (identifier.name !== "caches") {
                return false;
            }

            const variable = resolveVariable(identifier);
            return variable === null || variable.defs.length === 0;
        };

        const isCacheStorageExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                if (variable !== null) {
                    return cacheStorageVariables.has(variable);
                }

                return isUnshadowedCachesGlobal(node);
            }

            if (!isMemberExpression(node) || node.object.type === "Super") {
                return false;
            }

            return (
                getMemberPropertyName(node) === "caches" &&
                isIdentifier(node.object) &&
                cacheHostGlobals.has(node.object.name)
            );
        };

        const isCacheOpenCall = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);
            if (!isCallExpression(node) || !isMemberExpression(node.callee)) {
                return false;
            }

            if (
                node.callee.object.type === "Super" ||
                getMemberPropertyName(node.callee) !== "open"
            ) {
                return false;
            }

            return isCacheStorageExpression(node.callee.object);
        };

        const isCacheExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                return variable !== null && cacheVariables.has(variable);
            }

            return false;
        };

        const markVariableKinds = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isCacheStorageExpression(expression)) {
                cacheStorageVariables.add(variable);
            } else {
                cacheStorageVariables.delete(variable);
            }

            if (
                expression !== null &&
                (isCacheExpression(expression) || isCacheOpenCall(expression))
            ) {
                cacheVariables.add(variable);
            } else {
                cacheVariables.delete(variable);
            }
        };

        const reportMutation = (
            node: Readonly<TSESTree.CallExpression>,
            methodName: string,
            targetKind: CacheTargetKind
        ): void => {
            context.report({
                data: {
                    methodName,
                    targetKind,
                },
                messageId: "generic",
                node,
            });
        };

        return {
            AssignmentExpression(node): void {
                if (!isIdentifier(node.left)) {
                    return;
                }

                markVariableKinds(node.left, node.right);
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

                if (
                    cacheStorageMutatorMethods.has(methodName) &&
                    isCacheStorageExpression(node.callee.object)
                ) {
                    reportMutation(node, methodName, "CacheStorage");
                    return;
                }

                if (!cacheMutatorMethods.has(methodName)) {
                    return;
                }

                if (!isCacheExpression(node.callee.object)) {
                    return;
                }

                reportMutation(node, methodName, "Cache");
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
        deprecated: false,
        docs: {
            description:
                "disallow mutating Service Worker Cache API state via Cache/CacheStorage mutators.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cache-api-mutation",
        },
        messages: {
            generic:
                "Mutating {{targetKind}} with `{{methodName}}` is not allowed. Prefer immutable request/result derivation patterns.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noCacheApiMutationRule;
