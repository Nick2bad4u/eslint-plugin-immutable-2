import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import { createRule } from "../util/rule.js";
import {
    isBlockStatement,
    isIfStatement,
    isReturnStatement,
} from "../util/typeguard.js";

/** Rule name exported for config wiring. */
export const name = "no-conditional-statement" as const;

type Options = readonly [
    {
        readonly allowReturningBranches: "ifExhaustive" | boolean;
    },
];

const defaultOptions: Options = [{ allowReturningBranches: false }];

const optionsSchema: readonly JSONSchema4[] = [
    {
        additionalProperties: false,
        properties: {
            allowReturningBranches: {
                description:
                    "Allow conditional statements when branch bodies are return-oriented.",
                oneOf: [
                    {
                        description:
                            "When true, allows conditional statements where each branch returns.",
                        type: "boolean",
                    },
                    {
                        description:
                            "Allows returning conditionals only when they are exhaustive.",
                        enum: ["ifExhaustive"],
                        type: "string",
                    },
                ],
            },
        },
        type: "object",
    },
];

type MessageIds =
    | "incompleteBranch"
    | "incompleteIf"
    | "incompleteSwitch"
    | "unexpectedIf"
    | "unexpectedSwitch";

const getIfBranchViolations = (
    node: Readonly<TSESTree.IfStatement>
): readonly TSESTree.Node[] => {
    const branches: readonly [
        TSESTree.Statement,
        null | TSESTree.IfStatement | TSESTree.Statement,
    ] = [node.consequent, node.alternate];

    const violations: TSESTree.Node[] = [];
    for (const branch of branches) {
        if (branch === null) {
            continue;
        }

        if (isReturnStatement(branch) || isIfStatement(branch)) {
            continue;
        }

        if (
            isBlockStatement(branch) &&
            branch.body.some(
                (statement) =>
                    isReturnStatement(statement) || isIfStatement(statement)
            )
        ) {
            continue;
        }

        violations.push(branch);
    }

    return violations;
};

const getSwitchCaseViolations = (
    node: Readonly<TSESTree.SwitchStatement>
): readonly TSESTree.SwitchCase[] => {
    const violations: TSESTree.SwitchCase[] = [];

    for (const branch of node.cases) {
        if (branch.consequent.length === 0) {
            continue;
        }

        if (
            branch.consequent.some((statement) => isReturnStatement(statement))
        ) {
            continue;
        }

        const everyConsequentIsBlock = branch.consequent.every((statement) =>
            isBlockStatement(statement)
        );
        if (everyConsequentIsBlock) {
            const lastConsequent = branch.consequent.at(-1);
            if (
                lastConsequent !== undefined &&
                isBlockStatement(lastConsequent) &&
                lastConsequent.body.some((statement) =>
                    isReturnStatement(statement)
                )
            ) {
                continue;
            }
        }

        violations.push(branch);
    }

    return violations;
};

const isExhaustiveIfViolation = (
    node: Readonly<TSESTree.IfStatement>
): boolean => node.alternate === null;

const isExhaustiveSwitchViolation = (
    node: Readonly<TSESTree.SwitchStatement>
): boolean => node.cases.every((branch) => branch.test !== null);

/** `no-conditional-statement` rule implementation. */
const noConditionalStatementRule: ReturnType<
    typeof createRule<Options, MessageIds>
> = createRule<Options, MessageIds>({
    create(context, [options]) {
        const checkIfStatement = (
            node: Readonly<TSESTree.IfStatement>
        ): void => {
            if (options.allowReturningBranches === false) {
                context.report({
                    messageId: "unexpectedIf",
                    node,
                });
                return;
            }

            if (
                options.allowReturningBranches === "ifExhaustive" &&
                isExhaustiveIfViolation(node)
            ) {
                context.report({
                    messageId: "incompleteIf",
                    node,
                });

                return;
            }

            for (const violationNode of getIfBranchViolations(node)) {
                context.report({
                    messageId: "incompleteBranch",
                    node: violationNode,
                });
            }
        };

        const checkSwitchStatement = (
            node: Readonly<TSESTree.SwitchStatement>
        ): void => {
            if (options.allowReturningBranches === false) {
                context.report({
                    messageId: "unexpectedSwitch",
                    node,
                });
                return;
            }

            if (
                options.allowReturningBranches === "ifExhaustive" &&
                isExhaustiveSwitchViolation(node)
            ) {
                context.report({
                    messageId: "incompleteSwitch",
                    node,
                });

                return;
            }

            for (const violationNode of getSwitchCaseViolations(node)) {
                context.report({
                    messageId: "incompleteBranch",
                    node: violationNode,
                });
            }
        };

        return {
            IfStatement: checkIfStatement,
            SwitchStatement: checkSwitchStatement,
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{ allowReturningBranches: false }],
        docs: {
            description: "disallow conditional statements.",
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-conditional-statement",
        },
        messages: {
            incompleteBranch:
                "Incomplete branch. Every branch in a conditional statement must contain a return statement.",
            incompleteIf:
                "Incomplete if statement. It must have an else branch and each branch must return.",
            incompleteSwitch:
                "Incomplete switch statement. It must have a default case and each case must return.",
            unexpectedIf:
                "Unexpected if statement. Prefer a conditional expression instead.",
            unexpectedSwitch:
                "Unexpected switch statement. Prefer expression-based branching instead.",
        },
        schema: optionsSchema,
        type: "suggestion",
    },
    name,
});

export default noConditionalStatementRule;
