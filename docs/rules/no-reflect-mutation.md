# no-reflect-mutation

Disallow mutating objects through `Reflect` mutation APIs.

## Targeted pattern scope

This rule targets mutating static calls on `Reflect` that alter object state or shape.

## What this rule reports

- `Reflect.set(...)`
- `Reflect.deleteProperty(...)`
- `Reflect.defineProperty(...)`
- `Reflect.setPrototypeOf(...)`
- `Reflect.preventExtensions(...)`

## Why this rule exists

`Reflect` mutation methods provide low-level imperative object mutation capabilities. Their usage can bypass otherwise immutable coding conventions and make state transitions difficult to track.

This rule keeps object evolution explicit by flagging mutation-centric `Reflect` calls.

## ❌ Incorrect

```ts
const target = { value: 1 };
Reflect.set(target, "value", 2);
```

## ✅ Correct

```ts
const target = { value: 1 };
Reflect.get(target, "value");
```

## Additional examples

```ts
// ❌ Removes property from existing object in place
const target = { value: 1 };
Reflect.deleteProperty(target, "value");

// ✅ Reads object metadata without mutation
const target = { value: 1 };
Reflect.ownKeys(target);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-reflect-mutation": "error",
        },
    },
];
```

## When not to use it

If your architecture depends on runtime meta-programming with controlled `Reflect` mutations, this rule may be too restrictive for those internal layers.

> **Rule catalog ID:** R924

## Further reading

- [`Reflect` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
