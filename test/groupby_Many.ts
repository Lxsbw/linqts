import Linq from '../src/linq';

let data = {
  ZWMS_WERKS: '1000',
  ZWMS_MATNR: '02312SCU-NFA01',
  ZWMS_KCLX: '02',
  ZWMS_KCSL: 7,
  ZWMS_ZYSL: 2,
  ZWMS_LGORT: 'BJ41',
  ZWMS_NUMBE: 'Z2000156365',
  ZWMS_CONTAC: '1Y01032503120R',
  ZWMS_KCBJ: 'Z',
};

let list = [];
for (let index = 0; index < 200000; index++) {
  let ent = JSON.parse(JSON.stringify(data));
  ent.id = (index + 1).toString();
  list.push(ent);
}

// console.log('list:', list);
// console.log('list:', list.length);

// 分组

console.time('groupBy');

let result = new Linq(list).groupBy(el => el.id);

console.log('result:', result);

console.log('list:', list.length);
console.log('result:', result.length);

console.timeEnd('groupBy');
