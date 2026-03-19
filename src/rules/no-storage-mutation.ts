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
export const name = "no-storage-mutation" as const;

type MessageIds = "generic";
type Options = readonly [IgnoreAccessorPatternOption & IgnorePatternOption];
type StorageKind = "localStorage" | "sessionStorage";

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

/** Storage methods that mutate browser storage state in place. */
const storageMutatorMethods: ReadonlySet<string> = new Set([
    "clear",
    "removeItem",
    "setItem",
] as const);

/** Window-like globals that expose storage singletons. */
const storageHostGlobals: ReadonlySet<string> = new Set([
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

const getStorageKindFromName = (nameToCheck: string): null | StorageKind => {
    switch (nameToCheck) {
        case "localStorage":
        case "sessionStorage": {
            return nameToCheck;
        }

        default: {
            return null;
        }
    }
};

/** `no-storage-mutation` rule implementation. */
const noStorageMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const storageKindByVariable = new WeakMap<
            TSESLint.Scope.Variable,
            StorageKind
        >();

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

        const isUnshadowedStorageGlobal = (
            identifier: Readonly<TSESTree.Identifier>
        ): boolean => {
            const storageKind = getStorageKindFromName(identifier.name);
            if (storageKind === null) {
                return false;
            }

            const variable = resolveVariable(identifier);
            return variable === null || variable.defs.length === 0;
        };

        const getStorageKind = (
            expression: Readonly<TSESTree.Expression>
        ): null | StorageKind => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const trackedVariable = resolveVariable(node);
                if (trackedVariable !== null) {
                    return storageKindByVariable.get(trackedVariable) ?? null;
                }

                return isUnshadowedStorageGlobal(node)
                    ? getStorageKindFromName(node.name)
                    : null;
            }

            if (!isMemberExpression(node) || node.object.type === "Super") {
                return null;
            }

            const memberName =
                !node.computed && isIdentifier(node.property)
                    ? node.property.name
                    : node.computed &&
                        node.property.type === "Literal" &&
                        typeof node.property.value === "string"
                      ? node.property.value
                      : null;

            if (memberName === null) {
                return null;
            }

            const storageKind = getStorageKindFromName(memberName);
            if (storageKind === null || !isIdentifier(node.object)) {
                return null;
            }

            return storageHostGlobals.has(node.object.name)
                ? storageKind
                : null;
        };

        const markStorageVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression === null) {
                storageKindByVariable.delete(variable);
                return;
            }

            const storageKind = getStorageKind(expression);
            if (storageKind === null) {
                storageKindByVariable.delete(variable);
                return;
            }

            storageKindByVariable.set(variable, storageKind);
        };

        const reportMutation = (
            node:
                | Readonly<TSESTree.AssignmentExpression>
                | Readonly<TSESTree.CallExpression>
                | Readonly<TSESTree.UnaryExpression>
                | Readonly<TSESTree.UpdateExpression>,
            mutation: string,
            storageKind: StorageKind
        ): void => {
            context.report({
                data: {
                    mutation,
                    storageKind,
                },
                messageId: "generic",
                node,
            });
        };

        const getMutationNameFromMember = (
            memberExpression: Readonly<TSESTree.MemberExpression>
        ): string => {
            if (
                !memberExpression.computed &&
                isIdentifier(memberExpression.property)
            ) {
                return memberExpression.property.name;
            }

            if (
                memberExpression.computed &&
                memberExpression.property.type === "Literal" &&
                typeof memberExpression.property.value === "string"
            ) {
                return memberExpression.property.value;
            }

            return "<computed>";
        };

        return {
            AssignmentExpression(node): void {
                if (isIdentifier(node.left)) {
                    markStorageVariable(node.left, node.right);
                    return;
                }

                if (
                    shouldIgnore(node, context, options) ||
                    !isMemberExpression(node.left) ||
                    node.left.object.type === "Super"
                ) {
                    return;
                }

                const storageKind = getStorageKind(node.left.object);
                if (storageKind === null) {
                    return;
                }

                reportMutation(
                    node,
                    getMutationNameFromMember(node.left),
                    storageKind
                );
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
                if (!storageMutatorMethods.has(methodName)) {
                    return;
                }

                const storageKind = getStorageKind(node.callee.object);
                if (storageKind === null) {
                    return;
                }

                reportMutation(node, methodName, storageKind);
            },
            UnaryExpression(node): void {
                if (
                    node.operator !== "delete" ||
                    !isMemberExpression(node.argument) ||
                    node.argument.object.type === "Super" ||
                    shouldIgnore(node.argument, context, options)
                ) {
                    return;
                }

                const storageKind = getStorageKind(node.argument.object);
                if (storageKind === null) {
                    return;
                }

                reportMutation(
                    node,
                    getMutationNameFromMember(node.argument),
                    storageKind
                );
            },
            UpdateExpression(node): void {
                if (
                    !isMemberExpression(node.argument) ||
                    node.argument.object.type === "Super" ||
                    shouldIgnore(node.argument, context, options)
                ) {
                    return;
                }

                const storageKind = getStorageKind(node.argument.object);
                if (storageKind === null) {
                    return;
                }

                reportMutation(
                    node,
                    getMutationNameFromMember(node.argument),
                    storageKind
                );
            },
            VariableDeclarator(node): void {
                if (!isIdentifier(node.id)) {
                    return;
                }

                markStorageVariable(node.id, node.init);
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description:
                "disallow mutating localStorage/sessionStorage and their aliases.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-storage-mutation",
        },
        messages: {
            generic:
                "Mutating {{storageKind}} with `{{mutation}}` is not allowed. Derive immutable values instead of mutating shared storage.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noStorageMutationRule;
