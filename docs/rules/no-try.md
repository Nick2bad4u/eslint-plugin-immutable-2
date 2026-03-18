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

## Additional examples

```ts
// ❌ try/catch around JSON parsing
let payload;
try {
  payload = JSON.parse(raw);
} catch {
  return { ok: false, error: "Invalid JSON" };
}

// ✅ Dedicated safe parser that returns a result
const parseJson = (text: string) => {
  const parsed = safeJsonParse(text);
  return parsed.success
    ? { ok: true, value: parsed.value }
    : { ok: false, error: "Invalid JSON" };
};

return parseJson(raw);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
    plugins: { immutable },
    rules: {
      "immutable/no-try": "error",
    },
  },
];
```

## When not to use it

`try`/`finally` remains valuable for resource cleanup (file handles, locks, tracing spans). If your runtime boundary needs exception handling for interoperability, keep the rule off in those adapters while preserving it in pure domain code.

> **Rule catalog ID:** R912

## Further reading

- [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
