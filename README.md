# Linq for TypeScript

[![linqts](https://raw.githubusercontent.com/Lxsbw/linqts/main/linqts.png)](http://www.typescriptlang.org)

## From

https://github.com/kutyel/linq.ts

Thank you

## Install

```sh
npm install linq-to-ts --save
```

## Usage

### import
```typescript
import { Linq } from 'linq-to-ts';
```

### 1. All

```typescript
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const rst = new Linq<number>(numbers).All(x => x < 5);             // => false
```

### 2. Any

```typescript
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const rst = new Linq<number>(numbers).Any(x => x < 5);             // => true
```

### 3. Count

```typescript
const strArr = ['正一郎', '清次郎', '誠三郎', '征史郎'];
const intArr = [1, 5, 8, 12, 15, 16];

const rstStr = new Linq(strArr).Count();                           // => 4
const rstInt = new Linq<number>(intArr).Count(x => x % 2 === 0);   // => 3
```

### 4. Where & ToArray

```typescript
const intArr = [0, 1, 2, 3, 4];
// even number
const rst = new Linq<number>(dataA).Where(x => x % 2 === 0).ToArray();  // => [ 0, 2, 4 ]
```

### 5. Select & ToArray

```typescript
const parameters = [
  { ID: 5, Rate: 0.0, Name: '正一郎' },
  { ID: 13, Rate: 0.1, Name: '清次郎' },
  { ID: 25, Rate: 0.0, Name: '誠三郎' },
  { ID: 42, Rate: 0.3, Name: '征史郎' }
];

const rst = new Linq(parameters)
  .Select(x => { return { ID: x.ID, Name: x.Name }; }).ToArray();
// =>
// [
//   { ID: 5, Name: "正一郎" },
//   { ID: 13, Name: "清次郎" },
//   { ID: 25, Name: "誠三郎" },
//   { ID: 42, Name: "征史郎" }
// ]
```

### 6. SelectMany

```typescript
const parameters = [
  { Name: '正一郎', Numbers: [1, 2, 3] },
  { Name: '清次郎', Numbers: [1, 3, 5] },
  { Name: '誠三郎', Numbers: [2, 4, 6] },
  { Name: '征史郎', Numbers: [9, 8, 7] }
];

const rst = new Linq(parameters).SelectMany(x => new Linq(x.Numbers)).ToArray();  // => [1, 2, 3, 1, 3, 5, 2, 4, 6, 9, 8, 7]

```

### 7. Distinct

```typescript
const intArr = [0, 1, 3, 3, 2];
const parameters = [
  { ID: 5, Rate: 0.0, Name: '正一郎' },
  { ID: 13, Rate: 0.1, Name: '清次郎' },
  { ID: 25, Rate: 0.0, Name: '正一郎' },
  { ID: 42, Rate: 0.3, Name: '征史郎' }
];

const rstInt = new Linq(intArr).Distinct().ToArray();              // => [ 0, 1, 3, 2 ]
const rstObj = new Linq(parameters).Select(x => x.Name).Distinct().ToArray(); // => [ "正一郎", "清次郎", "征史郎" ]
```

### 8. First & FirstOrDefault

```typescript
const numbers = [1, 2, 3, 5, 7, 11];
const parameters = [
  { ID: 5, Name: '正一郎' },
  { ID: 13, Name: '清次郎' },
  { ID: 25, Name: '誠三郎' },
  { ID: 42, Name: '征史郎' }
];

const rstInt = new Linq(numbers).First();                                      // => 1
const rstObj = new Linq<Person>(parameters).FirstOrDefault(x => x.ID === 30);  // => undefined
const rstObj = new Linq<Person>(parameters).FirstOrDefault(x => x.ID === 42);  // => { ID: 42, Name: '征史郎' }
```

### 9. Remove

```typescript
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(numbers.length);                                    // => 10
new Linq(numbers).Remove(6);
console.log(numbers.length);                                    // => 9
```

### 10. OrderBy & OrderByDescending

```typescript
interface Person {
  ID: number;
  Name: string;
}
const parameters = [
  { ID: 0, Name: '正一郎' },
  { ID: 3, Name: '清次郎' },
  { ID: 2, Name: '誠三郎' },
  { ID: 5, Name: '征史郎' }
];

const rst = new Linq<Person>(parameters).OrderBy(x => x.ID).ToArray();
const rstDesc = new Linq<Person>(parameters).OrderByDescending(x => x.ID).ToArray();
// rst =>
// [
//   { ID: 0, Name: "正一郎" },
//   { ID: 2, Name: "誠三郎" },
//   { ID: 3, Name: "清次郎" },
//   { ID: 5, Name: "征史郎" }
// ]
// rstDesc =>
// [
//   { ID: 5, Name: "征史郎" },
//   { ID: 3, Name: "清次郎" },
//   { ID: 2, Name: "誠三郎" },
//   { ID: 0, Name: "正一郎" }
// ]

```

### 11. ThenBy & ThenByDescending

```typescript
interface Person {
  ID: number;
  Age: number;
  Name: string;
}
const persons = [
  { ID: 0, Age: 30, Name: 'A' },
  { ID: 1, Age: 25, Name: 'B' },
  { ID: 2, Age: 2, Name: 'G' },
  { ID: 2, Age: 18, Name: 'C' },
  { ID: 1, Age: 30, Name: 'D' },
  { ID: 1, Age: 25, Name: 'E' },
  { ID: 2, Age: 15, Name: 'F' }
];

const rst = new Linq<Person>(persons)
  .OrderByDescending(x => x.ID)
  .ThenBy(x => x.Age)
  .ThenByDescending(x => x.Name).ToArray();
// 1 OrderByDescending =>
// [
//   { ID: 2, Age: 2, Name: "G" },
//   { ID: 2, Age: 18, Name: "C" },
//   { ID: 2, Age: 15, Name: "F" },
//   { ID: 1, Age: 25, Name: "B" },
//   { ID: 1, Age: 30, Name: "D" },
//   { ID: 1, Age: 25, Name: "E" },
//   { ID: 0, Age: 30, Name: "A" }
// ]
// 2 ThenBy =>
// [
//   { ID: 2, Age: 2, Name: "G" },
//   { ID: 2, Age: 15, Name: "F" },
//   { ID: 2, Age: 18, Name: "C" },
//   { ID: 1, Age: 25, Name: "B" },
//   { ID: 1, Age: 25, Name: "E" },
//   { ID: 1, Age: 30, Name: "D" },
//   { ID: 0, Age: 30, Name: "A" }
// ]
// 3 ThenByDescending =>
// [
//   { ID: 2, Age: 2, Name: "G" },
//   { ID: 2, Age: 15, Name: "F" },
//   { ID: 2, Age: 18, Name: "C" },
//   { ID: 1, Age: 25, Name: "E" },
//   { ID: 1, Age: 25, Name: "B" },
//   { ID: 1, Age: 30, Name: "D" },
//   { ID: 0, Age: 30, Name: "A" }
// ]
```

### 12. GroupBy

```typescript
interface GroupObj {
  id: number;
  name: string;
  category: string;
  countries: string[];
}
const data = [
  { id: 1, name: 'one', category: 'fruits', countries: ['lxsbw', 'xliecz'] },
  { id: 1, name: 'one', category: 'fruits', countries: ['Italy', 'Austria'] },
  { id: 2, name: 'two', category: 'vegetables', countries: ['Italy', 'Germany'] }
];

const rstKey = new Linq<GroupObj>(data).GroupBy(el => el.category);
const rstKeys = new Linq<GroupObj>(data).GroupBy(el => {
  return { id: el.id, category: el.category };
});
// rstKey =>
// [
//   {
//     key: 1, count: 2,
//     elements: [
//       { id: 1, name: "one", category: "fruits", countries: [Array] },
//       { id: 1, name: "one", category: "fruits", countries: [Array] }
//     ]
//   },
//   {
//     key: 2, count: 1,
//     elements: [ { id: 2, name: "two", category: "vegetables", countries: [Array] } ]
//   }
// ]
// rstKeys =>
// [
//   {
//     key: { id: 1, category: "fruits" }, count: 2,
//     elements: [
//       { id: 1, name: "one", category: "fruits", countries: [Array] },
//       { id: 1, name: "one", category: "fruits", countries: [Array] }
//     ]
//   },
//   {
//     key: { id: 2, category: "vegetables" }, count: 1,
//     elements: [ { id: 2, name: "two", category: "vegetables", countries: [Array] } ]
//   }
// ]
```

### 13. DistinctBy

```typescript
const data = [
  { id: 1, name: 'one', category: 'fruits', countries: ['lxsbw', 'xliecz'] },
  { id: 1, name: 'one', category: 'fruits', countries: ['Italy', 'Austria'] },
  { id: 2, name: 'two', category: 'vegetables', countries: ['Italy', 'Germany'] }
];

const rstKey = new Linq(data).DistinctBy(x => x.category).ToArray();
const rstKeys = new Linq(data)
  .DistinctBy(el => {
    return { id: el.id, category: el.category };
  })
  .ToArray();
// rstKey =>
// [
//   { id: 1, name: "one", category: "fruits", countries: [ "lxsbw", "xliecz" ] },
//   { id: 2, name: "two", category: "vegetables", countries: [ "Italy", "Germany" ] }
// ]
// rstKeys =>
// [
//   { id: 1, name: "one", category: "fruits", countries: [ "lxsbw", "xliecz" ] },
//   { id: 2, name: "two", category: "vegetables", countries: [ "Italy", "Germany" ] }
// ]
```

### 14. Join

```typescript
const persons = [
  { CityID: 1, Name: 'ABC' },
  { CityID: 1, Name: 'EFG' },
  { CityID: 2, Name: 'HIJ' },
  { CityID: 3, Name: 'KLM' },
  { CityID: 3, Name: 'NOP' },
  { CityID: 4, Name: 'QRS' },
  { CityID: 5, Name: 'TUV' }
];
const cities = [
  { ID: 1, Name: 'Guangzhou' },
  { ID: 2, Name: 'Shenzhen' },
  { ID: 3, Name: 'Beijing' },
  { ID: 4, Name: 'Shanghai' }
];

const rst = new Linq(persons)
  .Join(
    new Linq(cities),
    p => p.CityID,
    c => c.ID,
    (p, c) => {
      return { CityID: c.ID, PersonName: p.Name, CityName: c.Name };
    }
  )
  .ToArray();
// rst =>
// [
//   { CityID: 1, PersonName: "ABC", CityName: "Guangzhou" },
//   { CityID: 1, PersonName: "EFG", CityName: "Guangzhou" },
//   { CityID: 2, PersonName: "HIJ", CityName: "Shenzhen" },
//   { CityID: 3, PersonName: "KLM", CityName: "Beijing" },
//   { CityID: 3, PersonName: "NOP", CityName: "Beijing" },
//   { CityID: 4, PersonName: "QRS", CityName: "Shanghai" }
// ]
```

### 15. ToDictionary

```typescript
const parameters = [
  { ID: 0, Age: 52, Name: '正一郎' },
  { ID: 8, Age: 28, Name: '清次郎' },
  { ID: 3, Age: 20, Name: '誠三郎' },
  { ID: 4, Age: 18, Name: '征史郎' }
];

const dictionary = new Linq(parameters).ToDictionary(x => x.ID).ToArray();
const dictionaryObj = new Linq(parameters)
  .ToDictionary(x => { return { ID: x.ID, Name: x.Name }; })
  .ToArray();
// dictionary =>
// [
//   { Key: 0, Value: { ID: 0, Age: 52, Name: "正一郎" } },
//   { Key: 8, Value: { ID: 8, Age: 28, Name: "清次郎" } },
//   { Key: 3, Value: { ID: 3, Age: 20, Name: "誠三郎" } },
//   { Key: 4, Value: { ID: 4, Age: 18, Name: "征史郎" } }
// ]
// dictionaryObj =>
// [
//   { Key: { ID: 0, Name: "正一郎" }, Value: { ID: 0, Age: 52, Name: "正一郎" } },
//   { Key: { ID: 8, Name: "清次郎" }, Value: { ID: 8, Age: 28, Name: "清次郎" } },
//   { Key: { ID: 3, Name: "誠三郎" }, Value: { ID: 3, Age: 20, Name: "誠三郎" } },
//   { Key: { ID: 4, Name: "征史郎" }, Value: { ID: 4, Age: 18, Name: "征史郎" } }
// ]
```

### 16. Sum

```typescript
interface Person {
  Age: number;
  Name: string;
}
const parameters = [
  { Age: 52, Name: '正一郎' },
  { Age: 28, Name: '清次郎' },
  { Age: 20, Name: '誠三郎' },
  { Age: 18, Name: '征史郎' }
];

const rst = new Linq<Person>(parameters).Sum(x => x.Age);       // => 118
```

### 17. Max

```typescript
interface Person {
  Age: number;
  Name: string;
}
const parameters = [
  { Age: 52, Name: '正一郎' },
  { Age: 28, Name: '清次郎' },
  { Age: 20, Name: '誠三郎' },
  { Age: 18, Name: '征史郎' }
];

const rst = new Linq<Person>(parameters).Max(x => x.Age);       // => 52
```

### 18. Min

```typescript
interface Person {
  Age: number;
  Name: string;
}
const parameters = [
  { Age: 52, Name: '正一郎' },
  { Age: 28, Name: '清次郎' },
  { Age: 20, Name: '誠三郎' },
  { Age: 18, Name: '征史郎' }
];

const rst = new Linq<Person>(parameters).Min(x => x.Age);       // => 18
```

### 19. Take

```typescript
const texts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const rst = new Linq(texts).Take(4).ToArray();                     // => [ "Sun", "Mon", "Tue", "Wed" ]
```

### 20. Skip

```typescript
const texts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const rst = new Linq(texts).Skip(4).ToArray();                     // => [ "Thu", "Fri", "Sat" ]
```

## Documentation

If you do not know Linq or just want to remember what is all about, have a look at the [docs](http://kutyel.github.io/linq.ts/docs/classes/list/index.html).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://flaviocorpa.com"><img src="https://avatars0.githubusercontent.com/u/5127501?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Flavio Corpa</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=kutyel" title="Code">💻</a> <a href="#question-kutyel" title="Answering Questions">💬</a> <a href="https://github.com/kutyel/linq.ts/commits?author=kutyel" title="Documentation">📖</a> <a href="https://github.com/kutyel/linq.ts/pulls?q=is%3Apr+reviewed-by%3Akutyel" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/Kurtz1993"><img src="https://avatars1.githubusercontent.com/u/5412470?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Luis Rogelio Hernández López</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=Kurtz1993" title="Code">💻</a> <a href="#tool-Kurtz1993" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/zskovacs"><img src="https://avatars3.githubusercontent.com/u/20083522?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Zsolt Kovács</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=zskovacs" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/abbasmhd"><img src="https://avatars2.githubusercontent.com/u/1510389?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Mo Abbas</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=abbasmhd" title="Code">💻</a></td>
    <td align="center"><a href="https://euipo.europa.eu/ohimportal/404"><img src="https://avatars3.githubusercontent.com/u/13154847?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Julián Salgado Napolitano</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=keropodium" title="Code">💻</a> <a href="#tool-keropodium" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/mstrzoda"><img src="https://avatars0.githubusercontent.com/u/22657637?v=3?s=100" width="100px;" alt=""/><br /><sub><b>mstrzoda</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=mstrzoda" title="Code">💻</a> <a href="https://github.com/kutyel/linq.ts/issues?q=author%3Amstrzoda" title="Bug reports">🐛</a> <a href="https://github.com/kutyel/linq.ts/commits?author=mstrzoda" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Zoxive"><img src="https://avatars0.githubusercontent.com/u/124676?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Kyle Wascher</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=Zoxive" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/jamesrichford"><img src="https://avatars1.githubusercontent.com/u/8244919?v=3?s=100" width="100px;" alt=""/><br /><sub><b>James Richford</b></sub></a><br /><a href="#tool-jamesrichford" title="Tools">🔧</a></td>
    <td align="center"><a href="https://in.linkedin.com/in/natarajanganapathi"><img src="https://avatars1.githubusercontent.com/u/9244766?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Natarajan Ganapathi</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=natarajanmca11" title="Code">💻</a> <a href="#tool-natarajanmca11" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/jbrekle"><img src="https://avatars0.githubusercontent.com/u/797614?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Brekle</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=jbrekle" title="Code">💻</a> <a href="https://github.com/kutyel/linq.ts/issues?q=author%3Ajbrekle" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/grofit"><img src="https://avatars3.githubusercontent.com/u/927201?v=4?s=100" width="100px;" alt=""/><br /><sub><b>LP</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=grofit" title="Code">💻</a> <a href="https://github.com/kutyel/linq.ts/commits?author=grofit" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/asierferro"><img src="https://avatars3.githubusercontent.com/u/1768777?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Asier Ferro</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=asierferro" title="Code">💻</a> <a href="#tool-asierferro" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/marlon-tucker"><img src="https://avatars2.githubusercontent.com/u/1166915?v=4?s=100" width="100px;" alt=""/><br /><sub><b>marlon-tucker</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=marlon-tucker" title="Code">💻</a> <a href="#tool-marlon-tucker" title="Tools">🔧</a> <a href="#platform-marlon-tucker" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/SkeletonSkelettron"><img src="https://avatars2.githubusercontent.com/u/26940527?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Misha Sulikashvili</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=SkeletonSkelettron" title="Code">💻</a> <a href="https://github.com/kutyel/linq.ts/commits?author=SkeletonSkelettron" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mrsauravsahu"><img src="https://avatars.githubusercontent.com/u/9134050?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Saurav Sahu</b></sub></a><br /><a href="#infra-mrsauravsahu" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/typescriptbob"><img src="https://avatars.githubusercontent.com/u/57693517?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bob Cook</b></sub></a><br /><a href="#financial-typescriptbob" title="Financial">💵</a></td>
    <td align="center"><a href="http://www.adrienrichard.com/"><img src="https://avatars.githubusercontent.com/u/25491408?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adrien</b></sub></a><br /><a href="https://github.com/kutyel/linq.ts/commits?author=Mrgove10" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Lxsbw/"><img src="https://avatars.githubusercontent.com/u/34436976?v=4" width="100px;" alt=""/><br /><sub><b>Lxsbw</b></sub></a><br /><a href="https://github.com/Lxsbw/linqts/commits?author=Lxsbw" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT
