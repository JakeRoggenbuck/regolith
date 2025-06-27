import { Regolith } from 'regolith';

const pattern = new Regolith("foo");

console.log(pattern.test("foobar"));
