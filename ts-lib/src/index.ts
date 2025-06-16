import { add } from 'crabby_regex';

export async function addNumbers(a: number, b: number): Promise<number> {
  return add(a, b);
}
