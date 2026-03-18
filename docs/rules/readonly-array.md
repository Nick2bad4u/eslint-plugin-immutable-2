# readonly-array

Prefer readonly arrays over mutable arrays.

## Targeted pattern scope

This rule targets TypeScript array types (`T[]`, `Array<T>`, tuples) and inferred mutable array-typed declarations.

## What this rule reports

- Mutable type forms like `string[]` and `Array<string>`
- Tuple/array types missing `readonly`
- Implicit array-typed declarations that should be explicitly readonly

## Why this rule exists

Readonly array types make mutation intent explicit and reduce accidental in-place updates.

## ❌ Incorrect

```ts
type Items = string[];
const values = [1, 2, 3];
```

## ✅ Correct

```ts
type Items = readonly string[];
const values: readonly unknown[] = [1, 2, 3];
```

> **Rule catalog ID:** R913

## Further reading

- [TypeScript readonly arrays](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)
