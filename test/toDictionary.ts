import Linq from '../src/linq';

let parameters = [
  { ID: 0, Age: 52, Name: '正一郎' },
  { ID: 8, Age: 28, Name: '清次郎' },
  { ID: 3, Age: 20, Name: '誠三郎' },
  { ID: 4, Age: 18, Name: '征史郎' }
];

let dictionary = new Linq(parameters).toDictionary(x => x.ID).toArray();
let dictionary2 = new Linq(parameters)
  .toDictionary(x => {
    return { ID: x.ID, Name: x.Name };
  })
  .toArray();

// dictionary3  = new jslinq(parameters).toDictionary \
//   ((value) -> value.ID, (value) -> value.Name).toArray()
console.log('dictionary:', dictionary);

console.log('dictionary2:', dictionary2);
