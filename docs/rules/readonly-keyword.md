# readonly-keyword

Require readonly modifiers where possible.

## Targeted pattern scope

This rule targets class fields, TypeScript property signatures, and TypeScript index signatures.

## What this rule reports

- Missing `readonly` on class properties
- Missing `readonly` on interface/type property signatures
- Missing `readonly` on index signatures

## Why this rule exists

Readonly properties communicate immutability at the type level and prevent accidental mutation.

## ❌ Incorrect

```ts
interface State {
  value: number;
}
```

## ✅ Correct

```ts
interface State {
  readonly value: number;
}
```

> **Rule catalog ID:** R914

## Further reading

- [TypeScript readonly modifier](https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly)
