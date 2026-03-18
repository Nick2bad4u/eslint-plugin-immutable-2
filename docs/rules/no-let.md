# no-let

Disallow mutable `let` declarations.

## Targeted pattern scope

This rule targets `VariableDeclaration` nodes where `kind === "let"`.

## What this rule reports

- Any `let` declaration not ignored by configured patterns

## Why this rule exists

`const` bindings better communicate immutability intent and prevent accidental reassignment.

## ❌ Incorrect

```ts
let total = 0;
```

## ✅ Correct

```ts
const total = 0;
```

> **Rule catalog ID:** R905

## Further reading

- [`let` and `const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
