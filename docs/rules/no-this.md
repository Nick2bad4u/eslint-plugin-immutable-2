# no-this

Disallow `this` usage.

## Targeted pattern scope

This rule targets `ThisExpression` nodes.

## What this rule reports

- Any usage of `this`

## Why this rule exists

Explicit parameters and return values make dependencies clear and improve referential transparency.

## ❌ Incorrect

```ts
this.value += 1;
```

## ✅ Correct

```ts
const increment = (value: number) => value + 1;
```

> **Rule catalog ID:** R910

## Further reading

- [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
