# no-atomics-mutation

Disallow mutating shared memory via `Atomics` write operations.

## Targeted pattern scope

This rule targets mutating static calls on `Atomics` that write into shared typed array memory.

## What this rule reports

- `Atomics.store(...)`
- `Atomics.add(...)`, `Atomics.sub(...)`
- `Atomics.and(...)`, `Atomics.or(...)`, `Atomics.xor(...)`
- `Atomics.exchange(...)`, `Atomics.compareExchange(...)`

## Why this rule exists

`Atomics` write operations mutate shared memory directly, introducing global mutable state across workers/threads.

This rule helps enforce immutable concurrency design by preventing in-place shared-memory writes at lint time.

## ❌ Incorrect

```ts
const view = new Int32Array(new SharedArrayBuffer(8));
Atomics.store(view, 0, 1);
```

## ✅ Correct

```ts
const view = new Int32Array(new SharedArrayBuffer(8));
Atomics.load(view, 0);
```

## Additional examples

```ts
// ❌ Mutates shared memory in place
const view = new Int32Array(new SharedArrayBuffer(8));
Atomics.compareExchange(view, 0, 1, 2);

// ✅ Read-only synchronization primitive
const view = new Int32Array(new SharedArrayBuffer(8));
Atomics.wait(view, 0, 0);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-atomics-mutation": "error",
        },
    },
];
```

## When not to use it

If your system intentionally uses shared-memory mutation via `Atomics` for low-level synchronization internals, this rule may be too strict for those specialized modules.

> **Rule catalog ID:** R923

## Further reading

- [`Atomics` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
