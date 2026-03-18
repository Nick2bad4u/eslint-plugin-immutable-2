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

## Additional examples

```ts
// ❌ Throwing during parsing
const parsePort = (value: string) => {
    const port = Number(value);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error("Invalid port");
    }
    return port;
};

// ✅ Returning explicit parse outcome
const parsePort = (value: string) => {
    const port = Number(value);
    if (!Number.isInteger(port) || port <= 0) {
        return { ok: false, error: "Invalid port" };
    }
    return { ok: true, value: port };
};
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-throw": "error",
        },
    },
];
```

## When not to use it

If your runtime model depends on exceptions (for example framework error boundaries, startup-fail-fast behavior, or assertion libraries), enforcing `no-throw` everywhere can be counterproductive. Prefer restricting this rule to business logic layers where value-based error handling is a goal.

> **Rule catalog ID:** R911

## Further reading

- [throw statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)
