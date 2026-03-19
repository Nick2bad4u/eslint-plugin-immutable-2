# no-typed-array-mutation

Disallow in-place mutation of JavaScript TypedArray instances.

## Targeted pattern scope

This rule targets mutating calls on known TypedArray instances created via constructors such as `Uint8Array`, `Int32Array`, `Float64Array`, and related TypedArray variants.

## What this rule reports

- TypedArray mutations via `.copyWithin(...)`
- TypedArray mutations via `.fill(...)`
- TypedArray mutations via `.reverse(...)`
- TypedArray mutations via `.set(...)`
- TypedArray mutations via `.sort(...)`

## Why this rule exists

TypedArrays are mutable by design. Once shared across code paths, in-place mutation methods silently alter state and can cause hard-to-debug data corruption in binary protocols, parsing pipelines, and cache layers.

This rule keeps byte-oriented data flow predictable by discouraging mutation after initialization.

## ❌ Incorrect

```ts
const bytes = new Uint8Array([1, 2, 3]);
bytes.fill(0);
```

## ✅ Correct

```ts
const bytes = new Uint8Array([1, 2, 3]);
const copy = bytes.slice();
copy[0];
```

## Additional examples

```ts
// ❌ Mutates typed array in place
const packet = new Uint8Array([3, 2, 1]);
packet.reverse();

// ✅ Derives a new view instead of mutating source
const packet = new Uint8Array([3, 2, 1]);
const sortedPacket = packet.slice().sort();
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-typed-array-mutation": "error",
        },
    },
];
```

## When not to use it

If your project intentionally mutates TypedArrays in tightly scoped performance-critical internals, this rule may be too strict for those files.

> **Rule catalog ID:** R917

## Further reading

- [TypedArray objects on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
