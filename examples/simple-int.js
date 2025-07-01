import { Regolith } from '@regolithjs/regolith';

const pattern = new Regolith('^\\d+$');

console.log(pattern.test('12345')); // true
console.log(pattern.test('Hello')); // false
