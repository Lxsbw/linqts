let dataA, dataA_F, dataB, dataB_F, dataC, dataC_F;

import Linq from '../../src/linq';

dataA = [0, 1, 2, 3, 4];
dataB = [1.5, 1.3, 3.2];
dataC = ['正一郎', '清次郎', '誠三郎', '征史郎'];

// 偶数
dataA_F = new Linq<number>(dataA).where(x => x % 2 === 0).toArray();
// 小于2
dataB_F = new Linq<number>(dataB).where(x => x < 2.0).toArray();
// 长度小于5
dataC_F = new Linq<string>(dataC).where(x => x.length < 5).toArray();

console.log('dataA_F:', dataA_F);
console.log('dataB_F:', dataB_F);
console.log('dataC_F:', dataC_F);
