import Linq from '../src/linq';

describe('Group 1:', () => {
  test('Add', () => {
    const list = new Linq([]);

    list.add('hey');
    expect(list.first()).toBe('hey');
  });

  test('Append', () => {
    const list = new Linq([]);

    list.addRange(['hey', "what's", 'up']);
    list.append('there');
    expect(list.last()).toBe('there');
  });
});
