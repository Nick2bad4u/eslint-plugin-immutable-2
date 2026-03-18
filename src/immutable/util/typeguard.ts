import type { TSESTree } from "@typescript-eslint/utils";
import type ts from "typescript";

/** TypeScript `ArrayConstructor` symbol type. */
export type ArrayConstructorType = ts.Type & {
    readonly symbol: {
        readonly name: "ArrayConstructor";
    };
};

/** Array-like TypeScript type with a direct `Array` symbol binding. */
export type ArrayType = ts.Type & {
    readonly symbol: {
        readonly name: "Array";
    };
};

/** TypeScript `ObjectConstructor` symbol type. */
export type ObjectConstructorType = ts.Type & {
    readonly symbol: {
        readonly name: "ObjectConstructor";
    };
};

/** Guard for assignment expressions. */
export const isAssignmentExpression = (
    node: TSESTree.Node
): node is TSESTree.AssignmentExpression => node.type === "AssignmentExpression";

/** Guard for assignment patterns. */
export const isAssignmentPattern = (
    node: TSESTree.Node
): node is TSESTree.AssignmentPattern => node.type === "AssignmentPattern";

/** Guard for array expressions. */
export const isArrayExpression = (
    node: TSESTree.Node
): node is TSESTree.ArrayExpression => node.type === "ArrayExpression";

/** Guard for block statements. */
export const isBlockStatement = (
    node: TSESTree.Node
): node is TSESTree.BlockStatement => node.type === "BlockStatement";

/** Guard for class-like declarations/expressions. */
export const isClassLike = (
    node: TSESTree.Node
): node is TSESTree.ClassDeclaration | TSESTree.ClassExpression =>
    node.type === "ClassDeclaration" || node.type === "ClassExpression";

/** Guard for call expressions. */
export const isCallExpression = (
    node: TSESTree.Node
): node is TSESTree.CallExpression => node.type === "CallExpression";

/** Guard for function-like nodes. */
export const isFunctionLike = (
    node: TSESTree.Node
): node is
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression =>
    node.type === "ArrowFunctionExpression" ||
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression";

/** Guard for identifiers. */
export const isIdentifier = (
    node: TSESTree.Node
): node is TSESTree.Identifier => node.type === "Identifier";

/** Guard for if statements. */
export const isIfStatement = (
    node: TSESTree.Node
): node is TSESTree.IfStatement => node.type === "IfStatement";

/** Guard for member expressions. */
export const isMemberExpression = (
    node: TSESTree.Node
): node is TSESTree.MemberExpression => node.type === "MemberExpression";

/** Guard for method definitions. */
export const isMethodDefinition = (
    node: TSESTree.Node
): node is TSESTree.MethodDefinition => node.type === "MethodDefinition";

/** Guard for new expressions. */
export const isNewExpression = (
    node: TSESTree.Node
): node is TSESTree.NewExpression => node.type === "NewExpression";

/** Guard for return statements. */
export const isReturnStatement = (
    node: TSESTree.Node
): node is TSESTree.ReturnStatement => node.type === "ReturnStatement";

/** Guard for `TSArrayType`. */
export const isTSArrayType = (
    node: TSESTree.Node
): node is TSESTree.TSArrayType => node.type === "TSArrayType";

/** Guard for `TSIndexSignature`. */
export const isTSIndexSignature = (
    node: TSESTree.Node
): node is TSESTree.TSIndexSignature => node.type === "TSIndexSignature";

/** Check whether a node is a `PropertyDefinition` (class field). */
export const isPropertyDefinition = (
    node: TSESTree.Node
): node is TSESTree.PropertyDefinition =>
    node.type === "PropertyDefinition";

/** Guard for `TSInterfaceBody`. */
export const isTSInterfaceBody = (
    node: TSESTree.Node
): node is TSESTree.TSInterfaceBody => node.type === "TSInterfaceBody";

/** Guard for `TSPropertySignature`. */
export const isTSPropertySignature = (
    node: TSESTree.Node
): node is TSESTree.TSPropertySignature => node.type === "TSPropertySignature";

/** Guard for `TSTypeOperator`. */
export const isTSTypeOperator = (
    node: TSESTree.Node
): node is TSESTree.TSTypeOperator => node.type === "TSTypeOperator";

/** Guard for type alias declarations. */
export const isTypeAliasDeclaration = (
    node: TSESTree.Node
): node is TSESTree.TSTypeAliasDeclaration =>
    node.type === "TSTypeAliasDeclaration";

/** Guard for variable declarations. */
export const isVariableDeclaration = (
    node: TSESTree.Node
): node is TSESTree.VariableDeclaration => node.type === "VariableDeclaration";

/** Guard for variable declarators. */
export const isVariableDeclarator = (
    node: TSESTree.Node
): node is TSESTree.VariableDeclarator => node.type === "VariableDeclarator";

/** Guard for TypeScript union types. */
const isUnionType = (type: ts.Type): type is ts.UnionType => type.isUnion();

/**
 * Check whether a TypeScript type (or alias symbol) has the expected symbol name.
 */
const hasTypeSymbolNamed = (type: ts.Type, expectedName: string): boolean => {
    const directSymbolName = type.symbol?.name;
    if (directSymbolName === expectedName) {
        return true;
    }

    const aliasSymbolName = type.aliasSymbol?.name;
    return aliasSymbolName === expectedName;
};

/**
 * Check whether a type should be treated as an array type.
 */
export const isArrayType = (
    type: null | ts.Type,
    assumeType = false,
    node: null | TSESTree.Node = null
): type is ArrayType => {
    if (assumeType) {
        return node !== null;
    }

    if (type === null) {
        return false;
    }

    if (hasTypeSymbolNamed(type, "Array")) {
        return true;
    }

    return isUnionType(type)
        ? type.types.some((memberType) => isArrayType(memberType, false, null))
        : false;
};

/**
 * Check whether a type should be treated as `ArrayConstructor`.
 */
export const isArrayConstructorType = (
    type: null | ts.Type,
    assumeType = false,
    node: null | TSESTree.Node = null
): type is ArrayConstructorType => {
    if (assumeType) {
        return node !== null && isIdentifier(node) && node.name === "Array";
    }

    if (type === null) {
        return false;
    }

    if (hasTypeSymbolNamed(type, "ArrayConstructor")) {
        return true;
    }

    return isUnionType(type)
        ? type.types.some((memberType) =>
              isArrayConstructorType(memberType, false, null)
          )
        : false;
};

/**
 * Check whether a type should be treated as `ObjectConstructor`.
 */
export const isObjectConstructorType = (
    type: null | ts.Type,
    assumeType = false,
    node: null | TSESTree.Node = null
): type is ObjectConstructorType => {
    if (assumeType) {
        return node !== null && isIdentifier(node) && node.name === "Object";
    }

    if (type === null) {
        return false;
    }

    if (hasTypeSymbolNamed(type, "ObjectConstructor")) {
        return true;
    }

    return isUnionType(type)
        ? type.types.some((memberType) =>
              isObjectConstructorType(memberType, false, null)
          )
        : false;
};
