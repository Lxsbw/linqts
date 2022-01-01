import List from '../linq';

let data = [
  { id: 1, name: 'one', category: 'fruits', countries: ['lxsbw', 'xliecz'] },
  { id: 1, name: 'one', category: 'fruits', countries: ['Italy', 'Austria'] },
  { id: 2, name: 'two', category: 'vegetables', countries: ['Italy', 'Germany'] }
  // { id: 3, name: 'three', category: 'vegetables', countries: ['Germany'] },
  // { id: 4, name: 'four', category: 'fruits', countries: ['Japan'] },
  // { id: 5, name: 'five', category: 'fruits', countries: ['Japan', 'Italy'] }
];

// 分组
let result = null;
// result = new List(data).GroupBy(el => el.category);
result = new List(data).GroupBy(el => {
  return { id: el.id, category: el.category };
});

// 去重
// result = new List(data)
//   .distinctBy((x) => x.category)
//   .toArray();
// result = new List(data)
//   .DistinctBy((el) => {
//     return { id: el.id, category: el.category };
//   })
//   .ToArray();

// result.forEach(x => console.log(x.key, x.count, x.elements));
console.log('result:', result);
// result.forEach((x) => console.log(x.elements));
// console.log('result:', JSON.stringify(result));
