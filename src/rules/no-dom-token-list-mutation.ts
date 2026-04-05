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
export const name = "no-dom-token-list-mutation" as const;

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

/** DOMTokenList mutator methods. */
const domTokenListMutatorMethods: ReadonlySet<string> = new Set([
    "add",
    "remove",
    "replace",
    "toggle",
] as const);

/** Common DOMTokenList-bearing properties. */
const domTokenListProperties: ReadonlySet<string> = new Set([
    "classList",
    "part",
    "relList",
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

/** `no-dom-token-list-mutation` rule implementation. */
const noDomTokenListMutationRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const domTokenListVariables = new WeakSet<TSESLint.Scope.Variable>();

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

        const isDomTokenListExpression = (
            expression: Readonly<TSESTree.Expression>
        ): boolean => {
            const node = unwrapExpression(expression);

            if (isIdentifier(node)) {
                const variable = resolveVariable(node);
                return variable !== null && domTokenListVariables.has(variable);
            }

            if (!isMemberExpression(node) || node.object.type === "Super") {
                return false;
            }

            const propertyName = getMemberPropertyName(node);
            return (
                propertyName !== null &&
                domTokenListProperties.has(propertyName)
            );
        };

        const markDomTokenListVariable = (
            identifier: Readonly<TSESTree.Identifier>,
            expression: null | Readonly<TSESTree.Expression>
        ): void => {
            const variable = resolveVariable(identifier);
            if (variable === null) {
                return;
            }

            if (expression !== null && isDomTokenListExpression(expression)) {
                domTokenListVariables.add(variable);
                return;
            }

            domTokenListVariables.delete(variable);
        };

        return {
            AssignmentExpression(node): void {
                if (!isIdentifier(node.left)) {
                    return;
                }

                markDomTokenListVariable(node.left, node.right);
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
                if (!domTokenListMutatorMethods.has(methodName)) {
                    return;
                }

                if (!isDomTokenListExpression(node.callee.object)) {
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

                markDomTokenListVariable(node.id, node.init);
            },
        };
    },
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            description:
                "disallow mutating DOMTokenList state such as classList/relList/part.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-dom-token-list-mutation",
        },
        messages: {
            generic:
                "Mutating DOMTokenList with `{{methodName}}` is not allowed. Prefer immutable view-model composition.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noDomTokenListMutationRule;
