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

for (const pet of pets) {
  console.log('pet:', pet);
}

console.log();
const petsCopy = [...pets];
for (const pet of petsCopy) {
  console.log('petsCopy:', pet);
}

console.log();
const petsss = new Linq<Pet>([])
console.log(petsss.toString() === '[object List]')
console.log(`${petsss}` === '[object List]')
