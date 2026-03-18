# no-conditional-statement

Disallow `if` and `switch` statements.

## Targeted pattern scope

This rule targets `IfStatement` and `SwitchStatement` nodes.

## What this rule reports

- Any `if` statement (or branch completeness issues when configured)
- Any `switch` statement (or case completeness issues when configured)

## Why this rule exists

Expression-oriented branching is easier to compose and test in immutable-style codebases.

## ❌ Incorrect

```ts
if (enabled) {
  return a;
}
return b;
```

## ✅ Correct

```ts
return enabled ? a : b;
```

## Additional examples

```ts
// ❌ Switch statement branching
switch (status) {
  case "idle":
    return "Ready";
  case "loading":
    return "Loading…";
  default:
    return "Done";
}

// ✅ Lookup table expression
const labels = {
  done: "Done",
  idle: "Ready",
  loading: "Loading…",
} as const;

return labels[status] ?? "Done";
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
    plugins: { immutable },
    rules: {
      "immutable/no-conditional-statement": "error",
    },
  },
];
```

## When not to use it

If your team favors explicit `if`/`switch` statements for readability (especially in long business workflows), enforcing expression-only branching can hurt clarity. In those modules, prefer keeping conventional branching and use other immutability rules to guard mutation.

> **Rule catalog ID:** R903

## Further reading

- [Conditional operator (`?:`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)
