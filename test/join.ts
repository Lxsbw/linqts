import Linq from '../src/linq';

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

const result = new Linq(persons)
  .Join(
    new Linq(cities),
    p => p.CityID,
    c => c.ID,
    (p, c) => {
      return { CityID: c.ID, PersonName: p.Name, CityName: c.Name };
    }
  )
  .ToArray();

console.log('result:', result);
