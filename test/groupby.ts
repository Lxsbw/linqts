import Linq from '../src/linq';

interface GroupObj {
  id: number;
  name: string;
  category: string;
  countries: string[];
}

let data = [
  { id: 1, name: 'one', category: 'fruits', countries: ['lxsbw', 'xliecz'] },
  { id: 1, name: 'one', category: 'fruits', countries: ['Italy', 'Austria'] },
  { id: 2, name: 'two', category: 'vegetables', countries: ['Italy', 'Germany'] }
  // { id: 3, name: 'three', category: 'vegetables', countries: ['Germany'] },
  // { id: 4, name: 'four', category: 'fruits', countries: ['Japan'] },
  // { id: 5, name: 'five', category: 'fruits', countries: ['Japan', 'Italy'] }
];

// 分组
// let result = null;
let result = new Linq(data).GroupBy(el => el.category);
// let result = new Linq<GroupObj>(data).GroupBy(el => {
//   return { id: el.id, category: el.category };
// });

// let result = new Linq(data).ToLookup(el => el.category);

// 去重
// let result = new Linq(data).DistinctBy(x => x.category).ToArray();
// let result = new Linq(data)
//   .DistinctBy(el => {
//     return { id: el.id, category: el.category };
//   })
//   .ToArray();

// result.forEach(x => console.log(x.key, x.count, x.elements));
console.log('result:', result);
// result.forEach((x) => console.log(x.elements));
// console.log('result:', JSON.stringify(result));
