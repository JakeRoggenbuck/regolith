# Regolith Testing Repo
This will be the Repo I use to test Regolith and how I would build it.
Once I know how to do it, I will make a new repo.

## Building

```sh
yarn build
```

## Running

```sh
node
```

```ts
const regolith = require("./index");
regolith.sum(1, 2)
```

### Crabby Rust --- OLD README
This is an experiment to try to get Rust's regex library to work in a TypeScript library. The reason for this is to prevent ReDoS attacks in TypeScript.

It's possible that this project will become that library. It is also possible that this will stay as the test version and a different repo will be made with a different name that will accomplish the goal of a safe TS regex library.

I was looking at other libraries that use Rust and TS and I found [SWC](https://github.com/swc-project/swc). This lead me to [napi-rs](https://github.com/napi-rs/napi-rs). This is going to make the project a lot easier.

### How often are look-around and backreferences used in software?
Review a lot of source code and try to find a percentage

### Why are the Rust and Go libraries categorically different to JavaScript and Python?
Why removing these features improves security

### A good post for HN or LinkedIn

### Update poster and turn it into a website blog post

### Name

I thought of an excellent name: https://www.npmjs.com/package/regolith -> **Regolith** and it's not taken!


