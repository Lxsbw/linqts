import Linq from '../src/linq';
interface Person {
  Age: number;
  Name: string;
}

let parameters = [
  { Age: 52, Name: '正一郎' },
  { Age: 28, Name: '清次郎' },
  { Age: 20, Name: '誠三郎' },
  { Age: 18, Name: '征史郎' }
];

let numbers = [
  { Age: 0, Name: '正一郎' },
  { Age: 0.3, Name: '清次郎' },
  { Age: 0.5, Name: '誠三郎' },
  { Age: 0.8, Name: '征史郎' }
];

let ageSum = new Linq<Person>(parameters).Sum(x => x.Age);
let ageSumByNum = new Linq(numbers).Sum(x => x.Age);
let ageMax = new Linq<Person>(parameters).Max(x => x.Age);
let ageMin = new Linq<Person>(parameters).Min(x => x.Age);
let ageDivByNum = new Linq<Person>(numbers).Average(x => x.Age);

console.log('ageSum:', ageSum);
console.log('ageSumByNum:', ageSumByNum);
console.log('ageDivByNum:', ageDivByNum);
console.log('ageMax:', ageMax);
console.log('ageMin:', ageMin);
