# no-expression-statement

Disallow standalone expression statements.

## Targeted pattern scope

This rule targets `ExpressionStatement` nodes, with optional ignore patterns.

## What this rule reports

- Top-level or block-level expression statements used only for side effects

## Why this rule exists

Expression statements often hide mutation and side effects. Explicit value flow is clearer in immutable code.

## ❌ Incorrect

```ts
doWork();
```

## ✅ Correct

```ts
const result = compute(input);
```

## Additional examples

```ts
// ❌ Side-effect expression statement
analytics.track("checkout_started");

// ✅ Explicit command collection
const event = {
    name: "checkout_started",
    timestamp: Date.now(),
};

return publishAnalytics(event);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-expression-statement": "error",
        },
    },
];
```

## When not to use it

Disable this rule for side-effect-centric entry points such as CLI bootstrap files, telemetry initializers, or test setup scripts. Those files are intentionally imperative, and forcing expression-only style there usually adds ceremony without real safety gains.

> **Rule catalog ID:** R904

## Further reading

- [Expression statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/Expression_statement)
