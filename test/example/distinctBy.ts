import Linq from '../../src/linq';

interface GroupObj {
  id: number;
  name: string;
  category: string;
  countries: string[];
}

let data = [
  { id: 1, name: 'one', category: 'fruits', countries: ['lxsbw', 'xliecz'] },
  { id: 1, name: 'one', category: 'fruits', countries: ['Italy', 'Austria'] },
  { id: 2, name: 'two', category: 'vegetables', countries: ['Italy', 'Germany'] },
  { id: 3, name: 'three', category: 'vegetables', countries: ['Germany'] },
  { id: 4, name: 'four', category: 'fruits', countries: ['Japan'] }
];

// 去重
let result1 = new Linq(data).distinctBy(x => x.category).toArray();
let result2 = new Linq(data)
  .orderBy(x => x.countries)
  .distinctBy(el => {
    return { id: el.id, category: el.category };
  })
  .toArray();

console.log('result:', result1);
console.log('result:', result2);
