import { Regolith } from "regolith";

const pattern = new Regolith("dog", "g");

console.log(pattern.test("my dog"));

const namePattern = new Regolith("(\\w+)\\s+(\\w+)");
const result = namePattern.exec("John Doe");
console.log(result);

const sentence = "dog, cat, dog";
const dogPattern = new Regolith("dog", "g");
console.log(dogPattern.match(sentence));

console.log(dogPattern.replace(sentence, "puppy"));

const catPattern = new Regolith("cat");
console.log(catPattern.search(sentence));

const splitPattern = new Regolith("[,\\|]");
console.log(splitPattern.split("apple,banana|orange"));

console.log(pattern.source);
console.log(pattern.flags);
console.log(pattern.global);
console.log(pattern.ignoreCase);
