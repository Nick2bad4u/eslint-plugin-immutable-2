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

> **Rule catalog ID:** R904

## Further reading

- [Expression statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/Expression_statement)
