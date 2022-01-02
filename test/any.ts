let numbers, reaultA, reaultB, reaultC;

import Linq from '../src/linq';

numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

reaultA = new Linq<number>(numbers).Any(function (value) {
  return value % 2 === 0;
});

reaultB = new Linq<number>(numbers).Any(function (value) {
  return value >= 10;
});

reaultC = new Linq<number>(numbers).Any(function (value) {
  return value < 5;
});

console.log('reaultA:', reaultA);

console.log('reaultB:', reaultB);

console.log('reaultC:', reaultC);
