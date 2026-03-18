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

## Additional examples

```ts
// ❌ Mutable function parameter
const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);

// ✅ Readonly parameter prevents accidental writes
const total = (values: readonly number[]) =>
    values.reduce((sum, value) => sum + value, 0);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        plugins: { immutable },
        rules: {
            "immutable/readonly-array": "error",
        },
    },
];
```

## When not to use it

If your code intentionally mutates arrays as part of low-level algorithms or performance-critical buffers, mandatory readonly annotations can add friction. In those locations, disable the rule locally and keep mutation constrained to well-documented utility modules.

> **Rule catalog ID:** R913

## Further reading

- [TypeScript readonly arrays](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)
