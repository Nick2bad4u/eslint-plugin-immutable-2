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

## Additional examples

```ts
// ❌ Implicit dependency on this-context
const account = {
    balance: 100,
    withdraw(amount: number) {
        this.balance -= amount;
        return this.balance;
    },
};

// ✅ Explicit state transition function
const withdraw = (balance: number, amount: number) => balance - amount;
const nextBalance = withdraw(100, 25);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-this": "error",
        },
    },
];
```

## When not to use it

Disable this rule for code that relies on framework-managed `this` binding (for example class-based decorators, Vue Options API, or legacy class components). In modern function-first modules, keeping the rule enabled improves dependency visibility.

> **Rule catalog ID:** R910

## Further reading

- [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
