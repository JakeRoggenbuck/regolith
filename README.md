# Regolith

[![Rust](https://img.shields.io/badge/Rust-1A5D8A?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=rust&sort=stargazers)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/JakeRoggenbuck?tab=repositories&q=&type=&language=typescript)

A TypeScript (currently mostly JS) library immune to Regular Expression Denial of Service (ReDoS) attacks by using Rust and linear RegEx under the hood. Regolith has a linear worst case time complexity, compared to the default RegExp found in TypeScript and JavaScript, which has an exponential worst case.

Regolith attempts to be a drop-in replacement for RegExp and requires minimal (to no) changes to be used instead. The goal of Regolith is to allow developers to easily build software that is immune to ReDoS attacks.

## Preventing ReDoS Attacks

### What are ReDoS attacks

[https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)

Here is an example of how Python has an exponetial increase in execution time for worst case.

![image](https://github.com/user-attachments/assets/bc346814-92ca-44c9-b906-d9fa22df7095)

Here is a table showing some popular languages and if their RegEx library has an exponential worst case or not.

![image](https://github.com/user-attachments/assets/e3e3fd36-35de-4958-b092-80ee04a590ec)

Images: Jake Roggenbuck - Preventing ReDoS Attacks - 2025

### How Regolith prevents them
- Talk about NFA
- Talk about Rust Regex

### What the result is
- Talk about all the different CVEs that happen and how they can be avoided

Since ReDoS vulnerabilites are hard to spot, there are rather frequent CVEs that get submitted. Having a RegEx library that has a linear worst case time would completely prevent all of these potential issues.

## Usage (Quick Start)

#### 1. Install

```
npm i regolith
```

#### 2. Try it out

```ts
import { Regolith } from 'regolith';

const pattern = new Regolith("^\\d+$");

pattern.test("12345");  // true
pattern.test("Hello");  // false
```

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
