import type { TSESTree } from "@typescript-eslint/utils";

import {
    isClassLike,
    isFunctionLike,
    isIdentifier,
    isMethodDefinition,
    isTSInterfaceBody,
} from "./typeguard.js";

/** Check whether a node is inside a function-like scope. */
export const inFunction = (node: Readonly<TSESTree.Node>): boolean => {
    let cursor: null | Readonly<TSESTree.Node> = node;

    while (cursor !== null) {
        if (isFunctionLike(cursor)) {
            return true;
        }

        cursor = cursor.parent ?? null;
    }

    return false;
};

/** Check whether a node is inside a class scope. */
export const inClass = (node: Readonly<TSESTree.Node>): boolean => {
    let cursor: null | Readonly<TSESTree.Node> = node;

    while (cursor !== null) {
        if (isClassLike(cursor)) {
            return true;
        }

        cursor = cursor.parent ?? null;
    }

    return false;
};

/** Check whether a node is inside a TypeScript interface body. */
export const inInterface = (node: Readonly<TSESTree.Node>): boolean => {
    let cursor: null | Readonly<TSESTree.Node> = node;

    while (cursor !== null) {
        if (isTSInterfaceBody(cursor)) {
            return true;
        }

        cursor = cursor.parent ?? null;
    }

    return false;
};

/**
 * Check whether a node is inside a class constructor method.
 */
export const inConstructor = (node: Readonly<TSESTree.Node>): boolean => {
    let cursor: null | Readonly<TSESTree.Node> = node;

    while (cursor !== null) {
        if (isMethodDefinition(cursor)) {
            return (
                isIdentifier(cursor.key) && cursor.key.name === "constructor"
            );
        }

        cursor = cursor.parent ?? null;
    }

    return false;
};

/**
 * Check whether a node sits within a function return-type annotation.
 */
export const isInReturnType = (node: Readonly<TSESTree.Node>): boolean => {
    let cursor: null | Readonly<TSESTree.Node> = node;

    while (cursor !== null) {
        const parent: Readonly<TSESTree.Node> | undefined = cursor.parent;
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
