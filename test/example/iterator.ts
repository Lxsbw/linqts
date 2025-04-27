import Linq from '../../src/linq';

interface IPet {
  Name: string;
  Age?: number;
  Vaccinated?: boolean;
}

class Pet implements IPet {
  public Name: string;
  public Age: number;
  public Vaccinated: boolean;

  constructor(pet: IPet) {
    this.Name = pet.Name;
    this.Age = pet.Age;
    this.Vaccinated = pet.Vaccinated;
  }
}

const pets = new Linq<Pet>([
  new Pet({ Age: 10, Name: 'Barley' }),
  new Pet({ Age: 4, Name: 'Boots' }),
  new Pet({ Age: 6, Name: 'Bissy' })
])


console.log('=============================== for...of ========================');
for (const pet of pets) {
  console.log('pet:', pet);
}

console.log();
console.log('=============================== [...pets] ========================');
const petsCopy = [...pets];
for (const pet of petsCopy) {
  console.log('petsCopy:', pet);
}

console.log();
console.log('=============================== Array.from() ========================');
const petsFrom = Array.from(pets);
for (const pet of petsFrom) {
  console.log('petsFrom:', pet);
}

console.log();
console.log('=============================== new Set() ========================');
const petsSet = new Set(pets);
console.log('petsSet:', petsSet);


console.log();
const petsss = new Linq<Pet>([]);
console.log(petsss.toString() === '[object List]');
console.log(`${petsss}` === '[object List]');
