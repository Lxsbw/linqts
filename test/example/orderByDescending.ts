let orderedParameters, parameters;

import Linq from '../../src/linq';
interface Person {
  ID: number;
  Name: string;
}
parameters = [
  { ID: 0, Name: '正一郎' },
  { ID: 3, Name: '清次郎' },
  { ID: 2, Name: '誠三郎' },
  { ID: 5, Name: '征史郎' }
];

console.log('parameters:', parameters);

orderedParameters = new Linq<Person>(parameters).orderByDescending(x => x.ID).toArray();

// console.log('parameters:', parameters);
console.log('orderedParameters:', orderedParameters);


const parametersNull = [
  { ID: null, Name: '正一郎' },
  { ID: 3, Name: '清次郎' },
  { ID: undefined, Name: '誠三郎' },
  { ID: 5, Name: '征史郎' },
];

console.log('Empty1:', new Linq(parametersNull).orderBy(x => x.ID).toArray());
console.log('Empty2:', new Linq(parametersNull).orderByDescending(x => x.ID).toArray());
