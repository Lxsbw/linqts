import Linq from '../../src/linq';

let parameters = [
  { Code: 'S', Name: '诗涵' },
  { Code: 'F', Name: '芳菲' },
  // { Code: 'U', Name: '悠悦' },
  { Code: 'H', Name: '慧琳' },
  { Code: 'E', Name: '恩琪' },
  { Code: 'R', Name: '睿萱' },
  { Code: 'B', Name: '碧琳' },
  { Code: 'C', Name: '采薇' },
  { Code: 'T', Name: '天翊' },
  { Code: 'G', Name: '冠宇' },
  { Code: 'Q', Name: '绮梦' },
  { Code: 'M', Name: '梦琪' },
  // { Code: 'V', Name: '薇雅' },
  { Code: 'Z', Name: '梓涵' },
  { Code: 'A', Name: '安雅' },
  // { Code: 'I', Name: '依诺' },
  { Code: 'Y', Name: '雅琴' },
  { Code: 'W', Name: '婉婷' },
  { Code: 'L', Name: '乐瑶' },
  { Code: 'K', Name: '可昕' },
  { Code: 'X', Name: '晓妍' },
  { Code: 'J', Name: '佳颖' },
  { Code: 'N', Name: '娜菲' },
  { Code: 'D', Name: '丹妮' },
  { Code: 'O', Name: '欧雅' },
  { Code: 'P', Name: '佩珊' },
];

console.log(new Linq(parameters).orderBy(x => x.Name).toArray());
console.log();
console.log(new Linq(parameters, 'zh-CN').orderBy(x => x.Name).toArray());


// parameters = [
//   { Code: 'A', Name: '安雅' },
//   { Code: 'B', Name: '碧琳' },
//   { Code: 'C', Name: '采薇' },
//   { Code: 'D', Name: '丹妮' },
//   { Code: 'E', Name: '恩琪' },
//   { Code: 'F', Name: '芳菲' },
//   { Code: 'G', Name: '冠宇' },
//   { Code: 'H', Name: '慧琳' },
//   // { Code: 'I', Name: '依诺' },
//   { Code: 'J', Name: '佳颖' },
//   { Code: 'K', Name: '可昕' },
//   { Code: 'L', Name: '乐瑶' },
//   { Code: 'M', Name: '梦琪' },
//   { Code: 'N', Name: '娜菲' },
//   { Code: 'O', Name: '欧雅' },
//   { Code: 'P', Name: '佩珊' },
//   { Code: 'Q', Name: '绮梦' },
//   { Code: 'R', Name: '睿萱' },
//   { Code: 'S', Name: '诗涵' },
//   { Code: 'T', Name: '天翊' },
//   // { Code: 'U', Name: '悠悦' },
//   // { Code: 'V', Name: '薇雅' },
//   { Code: 'W', Name: '婉婷' },
//   { Code: 'X', Name: '晓妍' },
//   { Code: 'Y', Name: '雅琴' },
//   { Code: 'Z', Name: '梓涵' }
// ];

// 使用 Fisher-Yates 洗牌算法打乱数组顺序
// for (let i = parameters.length - 1; i > 0; i--) {
//   const j = Math.floor(Math.random() * (i + 1));
//   [parameters[i], parameters[j]] = [parameters[j], parameters[i]];
// }
// console.log(parameters);
