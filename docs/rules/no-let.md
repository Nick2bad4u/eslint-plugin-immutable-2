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

## Additional examples

```ts
// ❌ Reassignment with let
let runningTotal = 0;
for (const value of values) {
    runningTotal += value;
}

// ✅ Declarative accumulation
const runningTotal = values.reduce((sum, value) => sum + value, 0);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-let": "error",
        },
    },
];
```

## When not to use it

`let` is still practical in tightly scoped algorithms where reassignment improves clarity (for example, pointer-based parsing loops or numeric simulations). If those hotspots are rare, keep `no-let` enabled globally and add selective per-file overrides.

> **Rule catalog ID:** R905

## Further reading

- [`let` and `const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
