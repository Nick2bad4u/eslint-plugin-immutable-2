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

> **Rule catalog ID:** R903

## Further reading

- [Conditional operator (`?:`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)
