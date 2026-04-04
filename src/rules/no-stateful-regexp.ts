import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../util/rule.js";
import { isIdentifier } from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-stateful-regexp" as const;

/** Returns stateful flags (`g`/`y`) in deterministic order. */
const getStatefulFlags = (flagsText: string): readonly string[] => {
    const statefulFlags: string[] = [];

    if (flagsText.includes("g")) {
        statefulFlags.push("g");
    }

    if (flagsText.includes("y")) {
        statefulFlags.push("y");
    }

    return statefulFlags;
};

const getStaticStringValue = (
    node: Readonly<TSESTree.Expression>
): null | string => {
    if (node.type === "Literal" && typeof node.value === "string") {
        return node.value;
    }

    if (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
    ) {
        return node.quasis[0]?.value.cooked ?? null;
    }

    return null;
};

/** `no-stateful-regexp` rule implementation. */
const noStatefulRegexpRule: ReturnType<
    typeof createRule<readonly [], "generic">
> = createRule<readonly [], "generic">({
    create(context) {
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

        const reportWhenStateful = (
            node: Readonly<TSESTree.Node>,
            flagsText: string
        ): void => {
            const statefulFlags = getStatefulFlags(flagsText);
            if (statefulFlags.length === 0) {
                return;
            }

            context.report({
                data: {
                    statefulFlags: statefulFlags.join("") || "<unknown>",
                },
                messageId: "generic",
                node,
            });
        };

        const checkRegExpCtorInvocation = (
            node:
                | Readonly<TSESTree.CallExpression>
                | Readonly<TSESTree.NewExpression>
        ): void => {
            if (
                !isIdentifier(node.callee) ||
                !isUnshadowedRegExpGlobal(node.callee)
            ) {
                return;
            }

            const flagsArgument = node.arguments[1];
            if (
                flagsArgument === undefined ||
                flagsArgument.type === "SpreadElement"
            ) {
                return;
            }

            const staticFlags = getStaticStringValue(flagsArgument);
            if (staticFlags === null) {
                return;
            }

            reportWhenStateful(node, staticFlags);
        };

        return {
            CallExpression(node): void {
                checkRegExpCtorInvocation(node);
            },
            Literal(node): void {
                if (!(node.value instanceof RegExp)) {
                    return;
                }

                reportWhenStateful(node, node.value.flags);
            },
            NewExpression(node): void {
                checkRegExpCtorInvocation(node);
            },
        };
    },
    meta: {
        docs: {
            description:
                "disallow stateful RegExp flags (`g`/`y`) that mutate `lastIndex`.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-stateful-regexp",
        },
        messages: {
            generic:
                "RegExp flag(s) `{{statefulFlags}}` create mutable `lastIndex` state. Prefer immutable matching patterns.",
        },
        schema: [],
        type: "suggestion",
    },
    name,
});

export default noStatefulRegexpRule;
