let orderByID, persons, thenByAge, thenByName;

import Linq from '../src/linq';

interface Person {
  ID: number;
  Age: number;
  Name: string;
}

persons = [
  { ID: 0, Age: 30, Name: 'A' },
  { ID: 1, Age: 25, Name: 'B' },
  { ID: 2, Age: 2, Name: 'G' },
  { ID: 2, Age: 18, Name: 'C' },
  { ID: 1, Age: 30, Name: 'D' },
  { ID: 1, Age: 25, Name: 'E' },
  { ID: 2, Age: 15, Name: 'F' }
];

orderByID = new Linq<Person>(persons).OrderByDescending(x => x.ID).ToArray();
thenByAge = new Linq<Person>(persons)
  .OrderByDescending(x => x.ID)
  .ThenBy(x => x.Age)
  .ToArray();
thenByName = new Linq<Person>(persons)
  .OrderByDescending(x => x.ID)
  .ThenBy(x => x.Age)
  .ThenByDescending(x => x.Name)
  .ToArray();

console.log('orderByID:', orderByID);
console.log('thenByAge:', thenByAge);
console.log('thenByName:', thenByName);
// console.log('persons:', persons);
