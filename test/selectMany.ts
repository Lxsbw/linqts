// jslinq = require('../linqjs/linq');
import Linq from '../src/linq';
class Dog {
  Name: string;
}

let parameters = [
  {
    Name: '正一郎',
    Numbers: [1, 2, 3]
  },
  {
    Name: '清次郎',
    Numbers: [1, 3, 5]
  },
  {
    Name: '誠三郎',
    Numbers: [2, 4, 6]
  },
  {
    Name: '征史郎',
    Numbers: [9, 8, 7]
  }
];

let personList = [
  {
    Name: 'P1',
    Age: 18,
    Gender: 'Male',
    Dogs: [{ Name: 'D1' }, { Name: 'D2' }]
  },
  {
    Name: 'P2',
    Age: 19,
    Gender: 'Male',
    Dogs: [{ Name: 'D3' }]
  },
  {
    Name: 'P3',
    Age: 17,
    Gender: 'Female',
    Dogs: [{ Name: 'D4' }, { Name: 'D5' }, { Name: 'D6' }]
  }
];

// var results = new Linq(personList).SelectMany(p => new Linq(p.Dogs)).ToArray();

let results = new Linq(parameters).SelectMany(x => new Linq(x.Numbers)).ToArray();

console.log('results:', results);
console.log('results:', results.length);
