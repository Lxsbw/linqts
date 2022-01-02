let dataA, dataA_D, dataB, dataB_D, dataC, dataC_D, dataC_E;

import Linq from '../src/linq';

dataA = [0, 1, 3, 3, 2];
dataB = [1.5, 1.5, 1.5, 1.5];
dataC = ['征史郎', '征四郎', '征史郎', '正史郎'];

let parameters = [
  {
    ID: 5,
    Rate: 0.0,
    Name: '正一郎'
  },
  {
    ID: 13,
    Rate: 0.1,
    Name: '清次郎'
  },
  {
    ID: 25,
    Rate: 0.0,
    Name: '正一郎'
  },
  {
    ID: 42,
    Rate: 0.3,
    Name: '征史郎'
  }
];

dataA_D = new Linq(dataA).Distinct().ToArray();
dataB_D = new Linq(dataB).Distinct().ToArray();
dataC_D = new Linq(dataC).Distinct().ToArray();
dataC_E = new Linq(parameters)
  .Select(x => x.Name)
  .Distinct()
  .ToArray();

console.log('dataA_D:', dataA_D);
console.log('dataB_D:', dataB_D);
console.log('dataC_D:', dataC_D);
console.log('dataC_E:', dataC_E);
