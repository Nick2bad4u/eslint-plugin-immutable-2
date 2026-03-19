# no-history-mutation

Disallow in-place mutation of browser `history` state.

## Targeted pattern scope

This rule targets direct usage of global `history` objects (including `window.history`, `self.history`, and aliases) when mutation APIs are called or history properties are written.

## What this rule reports

- `history.pushState(...)`
- `history.replaceState(...)`
- `history.back()`, `history.forward()`, `history.go(...)`
- Property assignments/deletes/updates on `history` and tracked aliases

## Why this rule exists

Browser history is a shared mutable global state machine. In-place navigation mutations create hidden side effects that are difficult to reason about in deterministic dataflow architectures.

This rule helps preserve immutability boundaries by preventing direct history mutations.

## ❌ Incorrect

```ts
history.pushState({ step: 2 }, "", "/step-2");
```

## ✅ Correct

```ts
const currentState = history.state;
```

## Additional examples

```ts
// ❌ Mutates global history state
const navHistory = history;
navHistory.replaceState({}, "", "/next");

// ✅ Reads history state without mutation
const navHistory = history;
navHistory.state;
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-history-mutation": "error",
        },
    },
];
```

## When not to use it

If your app intentionally centralizes imperative browser navigation in a dedicated adapter layer, this rule may be too strict outside that boundary.

> **Rule catalog ID:** R929

## Further reading

- [`History` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/History)
