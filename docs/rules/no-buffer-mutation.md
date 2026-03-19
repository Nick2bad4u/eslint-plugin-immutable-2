# no-buffer-mutation

Disallow in-place mutation of Node.js `Buffer` instances.

## Targeted pattern scope

This rule targets mutating calls on known `Buffer` instances created via static factories such as `Buffer.from(...)`, `Buffer.alloc(...)`, and related `Buffer` constructors/factories.

## What this rule reports

- `Buffer` mutations via `.write(...)` and numeric writer variants (for example `writeUInt16LE`)
- `Buffer` mutations via `.fill(...)`
- `Buffer` mutations via `.copy(...)`
- `Buffer` mutations via `.swap16(...)`, `.swap32(...)`, and `.swap64(...)`

## Why this rule exists

`Buffer` is a mutable binary container and is commonly shared across I/O boundaries, caches, and protocol layers. In-place writes can produce subtle cross-request state leaks and difficult-to-debug binary corruption.

This rule helps enforce immutable byte-flow patterns by flagging mutation APIs on known `Buffer` values.

## ❌ Incorrect

```ts
const payload = Buffer.from("abc");
payload.write("z");
```

## ✅ Correct

```ts
const payload = Buffer.from("abc");
payload.toString("utf8");
```

## Additional examples

```ts
// ❌ Mutates shared buffer instance
const bytes = Buffer.alloc(4);
bytes.fill(0xff);

// ✅ Uses non-mutating read-only interaction
const bytes = Buffer.alloc(4);
bytes.subarray(0, 2);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-buffer-mutation": "error",
        },
    },
];
```

## When not to use it

If your project intentionally uses mutable buffers in narrowly scoped hot-path internals and that mutability is part of your design, this rule may be too strict for those files.

> **Rule catalog ID:** R921

## Further reading

- [`Buffer` in Node.js docs](https://nodejs.org/api/buffer.html)
