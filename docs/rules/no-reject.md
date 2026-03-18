# no-reject

Disallow `Promise.reject(...)`.

## Targeted pattern scope

This rule targets `CallExpression` nodes matching `Promise.reject(...)`.

## What this rule reports

- Calls to `Promise.reject(...)`

## Why this rule exists

In immutable/functional error handling, explicit error values are often preferred over rejected promise control flow.

## ❌ Incorrect

```ts
return Promise.reject(new Error("boom"));
```

## ✅ Correct

```ts
return { ok: false, error: "boom" };
```

## Additional examples

```ts
// ❌ Rejecting promise for expected validation outcome
const loadUser = async (id: string) => {
    if (!id) {
        return Promise.reject(new Error("Missing user id"));
    }
    return fetchUser(id);
};

// ✅ Return a value-level failure object
const loadUser = async (id: string) => {
    if (!id) {
        return { ok: false, error: "Missing user id" };
    }
    return { ok: true, value: await fetchUser(id) };
};
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-reject": "error",
        },
    },
];
```

## When not to use it

Keep `Promise.reject` if your APIs intentionally model failures as rejected promises (for example, compatibility layers around fetch wrappers or public SDKs that consumers already handle with `.catch`). In that case, document the error contract and apply this rule only to internal logic.

> **Rule catalog ID:** R909

## Further reading

- [Promise.reject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
