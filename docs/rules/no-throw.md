# no-throw

Disallow `throw` statements.

## Targeted pattern scope

This rule targets `ThrowStatement` nodes.

## What this rule reports

- Any direct throw statement

## Why this rule exists

Value-level error handling (for example Result/Either patterns) can be easier to model and compose.

## ❌ Incorrect

```ts
throw new Error("fail");
```

## ✅ Correct

```ts
return { ok: false, error: "fail" };
```

> **Rule catalog ID:** R911

## Further reading

- [throw statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)
