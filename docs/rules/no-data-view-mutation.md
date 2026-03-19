# no-data-view-mutation

Disallow in-place mutation of `DataView` instances.

## Targeted pattern scope

This rule targets mutating setter calls on known `DataView` instances created via `new DataView(...)`, including direct constructor expressions and tracked variable aliases.

## What this rule reports

- `DataView` mutations via `.setInt8(...)`, `.setInt16(...)`, `.setInt32(...)`
- `DataView` mutations via `.setUint8(...)`, `.setUint16(...)`, `.setUint32(...)`
- `DataView` mutations via `.setFloat32(...)`, `.setFloat64(...)`
- `DataView` mutations via `.setBigInt64(...)`, `.setBigUint64(...)`

## Why this rule exists

`DataView` writes directly mutate an underlying `ArrayBuffer`. In shared binary workflows, these writes can create non-obvious side effects that propagate across decoding, parsing, and transport layers.

This rule encourages immutable binary-state handling by rejecting setter-based mutation on known `DataView` values.

## ❌ Incorrect

```ts
const view = new DataView(new ArrayBuffer(8));
view.setUint8(0, 255);
```

## ✅ Correct

```ts
const view = new DataView(new ArrayBuffer(8));
view.getUint8(0);
```

## Additional examples

```ts
// ❌ Mutates shared DataView state
const sharedView = new DataView(new ArrayBuffer(8));
sharedView.setFloat32(0, 1.5);

// ✅ Read-only DataView usage
const sharedView = new DataView(new ArrayBuffer(8));
sharedView.getFloat32(0);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-data-view-mutation": "error",
        },
    },
];
```

## When not to use it

If your code intentionally performs imperative writes through `DataView` for low-level binary protocols, this rule may be too strict for those tightly controlled modules.

> **Rule catalog ID:** R922

## Further reading

- [`DataView` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
