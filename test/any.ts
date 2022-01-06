let numbers, reaultA, reaultB, reaultC, reaultD;

import Linq from '../src/linq';

numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

reaultA = new Linq<number>(numbers).Any(function (value) {
  return value % 2 === 0;
});

reaultB = new Linq<number>(numbers).Any(function (value) {
  return value >= 10;
});

reaultC = new Linq<number>(numbers).Any(x => x < 5);
// reaultD = new Linq<number>(numbers).All(x => x < 5);

console.log('reaultA:', reaultA);
console.log('reaultB:', reaultB);
console.log('reaultC:', reaultC);
console.log('reaultD:', reaultD);

// deno run ./test/any.ts
