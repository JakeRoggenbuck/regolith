import { Regolith } from "@regolithjs/regolith";

const pattern = new Regolith("foo");

console.log(pattern.test("foobar"));
