import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

import { createRule } from "../util/rule.js";
import { isTSPropertySignature } from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-mixed-interface" as const;

const isFunctionPropertySignature = (
    node: Readonly<TSESTree.TypeElement>
): boolean => {
    if (!isTSPropertySignature(node) || node.typeAnnotation === undefined) {
        return false;
    }

    return (
        node.typeAnnotation.typeAnnotation.type ===
        AST_NODE_TYPES.TSFunctionType
    );
};

/** `no-mixed-interface` rule implementation. */
const noMixedInterfaceRule: ReturnType<
    typeof createRule<readonly [], "generic">
> = createRule<readonly [], "generic">({
    create(context) {
        return {
            TSInterfaceDeclaration(node) {
                let previousMemberType: null | TSESTree.TypeElement["type"] =
                    null;
                let previousMemberWasFunctionProperty = false;

                for (const member of node.body.body) {
                    const currentMemberType = member.type;
                    const currentMemberIsFunctionProperty =
                        isFunctionPropertySignature(member);

                    const isMixedType =
                        previousMemberType !== null &&
                        (previousMemberType !== currentMemberType ||
                            (previousMemberWasFunctionProperty !==
                                currentMemberIsFunctionProperty &&
                                (previousMemberWasFunctionProperty ||
                                    currentMemberIsFunctionProperty)));

                    if (isMixedType) {
                        context.report({
                            messageId: "generic",
                            node: member,
                        });
                    }

                    previousMemberType = currentMemberType;
                    previousMemberWasFunctionProperty =
                        currentMemberIsFunctionProperty;
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "disallow mixing incompatible member shapes in a single interface declaration.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-mixed-interface",
        },
        messages: {
            generic:
                "Mixed interface members detected. Keep interface members structurally consistent.",
        },
        schema: [],
        type: "suggestion",
    },
    name,
});

export default noMixedInterfaceRule;
