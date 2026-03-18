# no-loop-statement

Disallow imperative loop statements.

## Targeted pattern scope

This rule targets `for`, `for..in`, `for..of`, `while`, and `do..while` statements.

## What this rule reports

- Loop statements that mutate control flow imperatively

## Why this rule exists

Declarative transforms (`map`, `filter`, `reduce`) are usually easier to reason about in immutable systems.

## ❌ Incorrect

```ts
for (const item of items) {
  sum += item;
}
```

## ✅ Correct

```ts
const sum = items.reduce((acc, item) => acc + item, 0);
```

## Additional examples

```ts
// ❌ Imperative loop with mutable accumulator
let totalByUser = 0;
for (const order of orders) {
  if (order.userId === currentUserId) {
    totalByUser += order.total;
  }
}

// ✅ Composed filter + reduce pipeline
const totalByUser = orders
  .filter((order) => order.userId === currentUserId)
  .reduce((sum, order) => sum + order.total, 0);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
    plugins: { immutable },
    rules: {
      "immutable/no-loop-statement": "error",
    },
  },
];
```

## When not to use it

Loops can be the clearest option for early exits, streaming parsers, and certain performance-sensitive hotspots. If your team intentionally uses `for` loops in those places, scope-disable this rule there and keep it active elsewhere.

> **Rule catalog ID:** R906

## Further reading

- [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
