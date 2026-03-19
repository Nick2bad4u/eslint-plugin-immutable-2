# no-dom-token-list-mutation

Disallow in-place mutation of DOM token lists (`classList`, `relList`, `part`).

## Targeted pattern scope

This rule targets mutating `DOMTokenList` method calls on common token-list properties and aliases.

## What this rule reports

- `classList.add(...)`, `classList.remove(...)`, `classList.replace(...)`, `classList.toggle(...)`
- `relList.add(...)`, `relList.remove(...)`, `relList.replace(...)`, `relList.toggle(...)`
- `part.add(...)`, `part.remove(...)`, `part.replace(...)`, `part.toggle(...)`

## Why this rule exists

DOM token list mutation mutates shared UI state in place. In immutable architectures, mutating class/relationship token lists can hide side effects and make rendering behavior harder to reason about.

This rule helps enforce immutable view-state composition by flagging token-list mutators.

## ❌ Incorrect

```ts
element.classList.add("active");
```

## ✅ Correct

```ts
element.classList.contains("active");
```

## Additional examples

```ts
// ❌ Mutates DOM token list via alias
const tokens = element.classList;
tokens.toggle("open");

// ✅ Reads token state without mutation
const tokens = element.classList;
tokens.contains("open");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-dom-token-list-mutation": "error",
        },
    },
];
```

## When not to use it

If your rendering approach intentionally mutates DOM token lists imperatively (for example in low-level UI adapters), this rule may be too strict for those internals.

> **Rule catalog ID:** R935

## Further reading

- [`DOMTokenList` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList)
