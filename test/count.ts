let intArray, intCount, intCount2, stringCount, stringCount2, stringList;

import Linq from '../src/linq';

interface Bill {
  bill: number;
  box: string;
  sn?: string;
  status: number;
}

intArray = [1, 5, 8, 12, 15, 16];
stringList = ['正一郎', '清次郎', '誠三郎', '征史郎'];

let parameters: Bill[] = [
  { bill: 1, box: 'one', sn: 'fruits0', status: 30 },
  { bill: 1, box: 'one', sn: 'fruits1', status: 40 },
  { bill: 1, box: 'one', sn: undefined, status: 0 },
  { bill: 1, box: 'two', status: 30 },
  { bill: 1, box: 'three', sn: '', status: 30 },
  { bill: 1, box: 'four', sn: 'fruits6', status: 0 },
  { bill: 1, box: 'five', sn: null, status: 40 }
];

let parameters2: Bill[] = [
  { bill: 1, box: 'nine', sn: 'fruits0', status: 30 },
  { bill: 1, box: 'ten', sn: 'fruits1', status: 40 }
];

intCount = new Linq<number>(intArray).Count();
stringCount = new Linq(stringList).Count();
intCount2 = new Linq<number>(intArray).Count(function (value) {
  return value % 2 === 0;
});
stringCount2 = new Linq<string>(stringList).Count(function (value) {
  return value.indexOf('三') >= 0;
});

const Qty = new Linq(parameters).Count(x => x.sn && x.sn.length > 0);
const noQty = new Linq(parameters).Where(x => !x.sn);

console.log('intCount:', intCount);
console.log('stringCount:', stringCount);
console.log('intCount2:', intCount2);
console.log('stringCount2:', stringCount2);
console.log('Qty:', Qty);
console.log('noQty:', noQty);

new Linq(parameters).AddRange(parameters2);
console.log(parameters);
