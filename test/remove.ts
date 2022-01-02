import Linq from '../src/linq';

let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(numbers.length);

new Linq(numbers).Remove(6);

console.log(numbers);

console.log(numbers.length);
