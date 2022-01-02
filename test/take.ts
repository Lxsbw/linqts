let numbers, takenNumbers, takenTexts, texts;

import Linq from '../src/linq';

numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

texts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 开始的3个
takenNumbers = new Linq(numbers).Take(3).ToArray();

// 开始的4个
takenTexts = new Linq(texts).Take(4).ToArray();

console.log('takenNumbers:', takenNumbers);

console.log('takenTexts:', takenTexts);
