import type { TSESTree } from "@typescript-eslint/utils";
import type { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

import { arrayAt } from "ts-extras";

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

const isNonReturningBranchStatement = (
    statement: Readonly<TSESTree.Statement>
): boolean => !isReturnStatement(statement) && !isIfStatement(statement);

const isNotReturnStatement = (
    statement: Readonly<TSESTree.Statement>
): boolean => !isReturnStatement(statement);

const isIfBranchViolation = (
    branch: null | Readonly<TSESTree.Statement>
): branch is TSESTree.Statement => {
    if (branch === null || isReturnStatement(branch) || isIfStatement(branch)) {
        return false;
    }

    if (!isBlockStatement(branch)) {
        return true;
    }

    return branch.body.every((statement) =>
        isNonReturningBranchStatement(statement)
    );
};

const getIfBranchViolations = (
    node: Readonly<TSESTree.IfStatement>
): readonly TSESTree.Node[] => {
    const branches: readonly [
        TSESTree.Statement,
        | null
        | TSESTree.IfStatement
        | TSESTree.Statement,
    ] = [node.consequent, node.alternate];

    return branches.filter(isIfBranchViolation);
};

const isSwitchCaseViolation = (
    branch: Readonly<TSESTree.SwitchCase>
): boolean => {
    if (
        branch.consequent.length === 0 ||
        branch.consequent.some((statement) => isReturnStatement(statement))
    ) {
        return false;
    }

    const blockConsequents = branch.consequent.filter((statement) =>
        isBlockStatement(statement)
    );
    if (blockConsequents.length !== branch.consequent.length) {
        return true;
    }

    const lastConsequent = arrayAt(branch.consequent, -1);
    if (lastConsequent === undefined || !isBlockStatement(lastConsequent)) {
        return true;
    }

    return lastConsequent.body.every((statement) =>
        isNotReturnStatement(statement)
    );
};

const getSwitchCaseViolations = (
    node: Readonly<TSESTree.SwitchStatement>
): readonly TSESTree.SwitchCase[] =>
    node.cases.filter((branch) => isSwitchCaseViolation(branch));

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
    meta: {
        defaultOptions: [{ allowReturningBranches: false }],
        deprecated: false,
        docs: {
            description: "disallow conditional statements.",
            frozen: false,
            recommended: false,
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
