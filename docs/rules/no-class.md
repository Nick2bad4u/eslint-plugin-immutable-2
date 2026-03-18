# no-class

Disallow class declarations and expressions.

## Targeted pattern scope

This rule targets `class` syntax in declarations and expressions.

## What this rule reports

- `class Name {}` declarations
- `const X = class {}` expressions

## Why this rule exists

Class instances often rely on mutable state. Functional composition with plain objects is easier to keep immutable.

## ❌ Incorrect

```ts
class Counter {
  value = 0;
}
```

## ✅ Correct

```ts
const createCounter = () => ({ value: 0 });
```

> **Rule catalog ID:** R902

## Further reading

- [Functional programming in TypeScript](https://www.typescriptlang.org/docs/handbook/functions.html)
