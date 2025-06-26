# Regolith

[![Rust](https://img.shields.io/badge/Rust-1A5D8A?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=rust&sort=stargazers)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=typescript)

A TypeScript (currently JS) library immune to ReDoS attacks by using Rust under the hood.

^^ This needs a better explanation about how it's a categorically different way of doing regex that cannot be attack by ReDoS in the same way by not supporting the features that cause ReDoS.

## Preventing ReDoS Attacks

### What are ReDoS attacks
- Show an example
- Show the effect

### How Regolith prevents them
- Talk about NFA
- Talk about Rust Regex

### What the result is
- Talk about all the different CVEs that happen and how they can be avoided

## Usage (Quick Start)

- Show a quick start guide for how to use Regolith

## Development

### Building

```sh
yarn build
```

### Running

```sh
node
```

```ts
import { Regolith } from './regolith';

const integerPattern = new Regolith("^\\d+$");

console.log("Integer test:", integerPattern.test("12345")); // true
console.log("Integer test:", integerPattern.test("12a45")); // false
```

### Testing

```
yarn test
```

You should see the tests complete. Currently, there are 79 tests that get run.

![image](https://github.com/user-attachments/assets/ad1fb9e6-9456-4ee1-830d-ab927401de81)

### Publishing Checklist

1. Increment the version in [package.json](./package.json)
2. All changes are merged into main
3. Run the tests with `yarn test`
4. Run `npm login`
5. Run `npm publish`
