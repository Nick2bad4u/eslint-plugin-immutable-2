# no-class

Disallow class declarations and expressions.

## Targeted pattern scope

This rule targets `class` syntax in declarations and expressions.

## What this rule reports

- `class Name {}` declarations
- `const X = class {}` expressions

## Why this rule exists

Class instances often rely on mutable state. Functional composition with plain objects is easier to keep immutable.

## ❌ Incorrect

```ts
class Counter {
  value = 0;
}
```

## ✅ Correct

```ts
const createCounter = () => ({ value: 0 });
```

## Additional examples

```ts
// ❌ Class expression keeps mutable instance state
const Store = class {
    private cache = new Map<string, string>();
};

// ✅ Factory returns explicit values and functions
const setEntry = (
    cache: ReadonlyMap<string, string>,
    key: string,
    value: string,
) => new Map([...cache.entries(), [key, value]]);

const createStore = (cache: ReadonlyMap<string, string> = new Map()) => ({
    get: (key: string) => cache.get(key),
    set: (key: string, value: string) => createStore(setEntry(cache, key, value)),
});
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
    plugins: { immutable },
    rules: {
      "immutable/no-class": "error",
    },
  },
];
```

## When not to use it

You may disable this rule in framework layers that require class-based APIs (for example older React class components, some decorator-driven DI frameworks, or inheritance-heavy SDK extension points). A practical compromise is enabling `no-class` for application code while carving out a narrow override for those integration folders.

> **Rule catalog ID:** R902

## Further reading

- [Functional programming in TypeScript](https://www.typescriptlang.org/docs/handbook/functions.html)
