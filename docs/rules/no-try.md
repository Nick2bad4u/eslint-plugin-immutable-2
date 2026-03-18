# no-try

Disallow `try`/`catch`/`finally`.

## Targeted pattern scope

This rule targets `TryStatement` nodes.

## What this rule reports

- Any `try { ... } catch { ... }` or `try/finally` pattern

## Why this rule exists

This encourages explicit, value-oriented control flow over exception-based branching.

## ❌ Incorrect

```ts
try {
  run();
} catch {
  recover();
}
```

## ✅ Correct

```ts
const result = runSafely();
if (!result.ok) {
  return recover(result.error);
}
```

> **Rule catalog ID:** R912

## Further reading

- [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
