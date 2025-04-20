let dataA, dataA_D, dataB, dataB_D, dataC, dataC_D;

import Linq from '../../src/linq';

dataA = [0, 1, 3, 3, 2];
dataB = [1.5, 1.5, 1.5, 1.5];
dataC = ['征史郎', '征四郎', '征史郎', '正史郎'];

let parameters = [
  { bill: 1, box: 'one', sn: 'fruits0', status: 30 },
  { bill: 1, box: 'one', sn: 'fruits1', status: 40 },
  { bill: 1, box: 'one', sn: 'fruits2', status: 0 },
  { bill: 1, box: 'two', sn: 'fruits3', status: 30 },
  { bill: 1, box: 'three', sn: 'fruits4', status: 30 },
  { bill: 1, box: 'four', sn: 'fruits4', status: 0 },
  { bill: 1, box: 'five', sn: 'fruits5', status: 40 }
];

// parameters = [];

// dataC_E = new Linq(parameters).select(x=>x.Name).distinct().toArray();

let boxs = new Linq(parameters).select(x => x.box).distinct();

const res = boxs.count(x => new Linq(parameters).where(p => p.box === x).all(p => [30, 40].includes(p.status)));

console.log('boxs:', boxs.toArray());
console.log('res:', res);
