# immutable-data

Treat objects and arrays as immutable values.

## Targeted pattern scope

This rule targets mutation of existing objects and arrays through assignments, updates, `delete`, mutating array methods, and `Object.assign` into an existing target.

## What this rule reports

- Member assignments like `obj.key = value`
- Member updates like `obj.count++`
- `delete obj.key`
- Mutating array methods such as `.push()` and `.splice()`
- `Object.assign(existing, patch)` style mutations

## Why this rule exists

In-place mutation makes code harder to reason about, test, and refactor. Immutable updates improve predictability and composition.

## ❌ Incorrect

```ts
state.value = 2;
items.push(newItem);
Object.assign(existing, patch);
```

## ✅ Correct

```ts
const nextState = { ...state, value: 2 };
const nextItems = [...items, newItem];
const merged = { ...existing, ...patch };
```

> **Rule catalog ID:** R901

## Further reading

- [Immutable update patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)
- [JavaScript array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
