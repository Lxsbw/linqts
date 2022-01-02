import Linq from '../src/linq';
interface Person {
  Age: number;
  Name: string;
}

let parameters = [
  {
    Age: 52,
    Name: '正一郎'
  },
  {
    Age: 28,
    Name: '清次郎'
  },
  {
    Age: 20,
    Name: '誠三郎'
  },
  {
    Age: 18,
    Name: '征史郎'
  }
];

let ageSum = new Linq<Person>(parameters).Sum(function (value) {
  return value.Age;
});

console.log('ageSum:', ageSum);
