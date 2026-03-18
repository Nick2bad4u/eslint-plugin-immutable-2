import type { TSESTree } from "@typescript-eslint/utils";

import {
    isClassLike,
    isFunctionLike,
    isIdentifier,
    isMethodDefinition,
    isTSInterfaceBody,
} from "./typeguard.js";

/**
 * Find the nearest ancestor (including the current node) matching a guard.
 *
 * @param node - Starting AST node.
 * @param matcher - Type-guard matcher.
 *
 * @returns Matching node when found; otherwise `null`.
 */
const findParentOfType = <TNode extends TSESTree.Node>(
    node: TSESTree.Node,
    matcher: (candidate: TSESTree.Node) => candidate is TNode
): null | TNode => {
    let cursor: null | TSESTree.Node = node;

    while (cursor !== null) {
        if (matcher(cursor)) {
            return cursor;
        }

        cursor = cursor.parent ?? null;
    }

    return null;
};

/** Check whether a node is inside a function-like scope. */
export const inFunction = (node: TSESTree.Node): boolean =>
    findParentOfType(node, isFunctionLike) !== null;

/** Check whether a node is inside a class scope. */
export const inClass = (node: TSESTree.Node): boolean =>
    findParentOfType(node, isClassLike) !== null;

/** Check whether a node is inside a TypeScript interface body. */
export const inInterface = (node: TSESTree.Node): boolean =>
    findParentOfType(node, isTSInterfaceBody) !== null;

/**
 * Check whether a node is inside a class constructor method.
 */
export const inConstructor = (node: TSESTree.Node): boolean => {
    const methodNode = findParentOfType(node, isMethodDefinition);
    if (methodNode === null) {
        return false;
    }

    return isIdentifier(methodNode.key) && methodNode.key.name === "constructor";
};

/**
 * Check whether a node sits within a function return-type annotation.
 */
export const isInReturnType = (node: TSESTree.Node): boolean => {
    let cursor: null | TSESTree.Node = node;

    while (cursor !== null) {
        const parent: TSESTree.Node | undefined = cursor.parent;
        if (parent === undefined) {
            return false;
        }

        if (isFunctionLike(parent) && parent.returnType === cursor) {
            return true;
        }

        cursor = parent;
    }

    return false;
};
