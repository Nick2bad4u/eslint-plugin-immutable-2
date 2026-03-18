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

> **Rule catalog ID:** R906

## Further reading

- [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
