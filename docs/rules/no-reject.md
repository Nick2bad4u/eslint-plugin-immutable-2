# no-reject

Disallow `Promise.reject(...)`.

## Targeted pattern scope

This rule targets `CallExpression` nodes matching `Promise.reject(...)`.

## What this rule reports

- Calls to `Promise.reject(...)`

## Why this rule exists

In immutable/functional error handling, explicit error values are often preferred over rejected promise control flow.

## ❌ Incorrect

```ts
return Promise.reject(new Error("boom"));
```

## ✅ Correct

```ts
return { ok: false, error: "boom" };
```

> **Rule catalog ID:** R909

## Further reading

- [Promise.reject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
