type PredicateType<T> = (value?: T, index?: number, list?: T[]) => boolean;
interface GroupType<T> {
  key?: T;
  count?: number;
  elements?: any;
}

class Linq<T> {
  protected _elements: T[];

  /**
   * Defaults the elements of the list
   */
  constructor(elements: T[] = []) {
    this._elements = elements;
  }

  /**
   * Adds an object to the end of the Linq<T>.
   */
  public Add(element: T): void {
    this._elements.push(element);
  }

  /**
   * Appends an object to the end of the Linq<T>.
   */
  public Append(element: T): void {
    this.Add(element);
  }

  /**
   * Add an object to the start of the Linq<T>.
   */
  public Prepend(element: T): void {
    this._elements.unshift(element);
  }

  /**
   * Adds the elements of the specified collection to the end of the Linq<T>.
   */
  public AddRange(elements: T[]): void {
    this._elements.push(...elements);
  }

  /**
   * Applies an accumulator function over a sequence.
   */
  public Aggregate<U>(accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any, initialValue?: U): any {
    return this._elements.reduce(accumulator, initialValue);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  public All(predicate: PredicateType<T>): boolean {
    return this._elements.every(predicate);
  }

  /**
   * Determines whether a sequence contains any elements.
   */
  public Any(): boolean;
  public Any(predicate: PredicateType<T>): boolean;
  public Any(predicate?: PredicateType<T>): boolean {
    return predicate ? this._elements.some(predicate) : this._elements.length > 0;
  }

  /**
   * Computes the average of a sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public Average(): number;
  public Average(transform: (value?: T, index?: number, list?: T[]) => any): number;
  public Average(transform?: (value?: T, index?: number, list?: T[]) => any): number {
    return this.Sum(transform) / this.Count(transform);
  }

  /**
   * Casts the elements of a sequence to the specified type.
   */
  public Cast<U>(): Linq<U> {
    return new Linq<U>(this._elements as any);
  }

  /**
   * Removes all elements from the Linq<T>.
   */
  public Clear(): void {
    this._elements.length = 0;
  }

  /**
   * Concatenates two sequences.
   */
  public Concat(list: Linq<T>): Linq<T> {
    return new Linq<T>(this._elements.concat(list.ToArray()));
  }

  /**
   * Determines whether an element is in the Linq<T>.
   */
  public Contains(element: T): boolean {
    return this.Any(x => x === element);
  }

  /**
   * Returns the number of elements in a sequence.
   */
  public Count(): number;
  public Count(predicate: PredicateType<T>): number;
  public Count(predicate?: PredicateType<T>): number {
    return predicate ? this.Where(predicate).Count() : this._elements.length;
  }

  /**
   * Returns the elements of the specified sequence or the type parameter's default value
   * in a singleton collection if the sequence is empty.
   */
  public DefaultIfEmpty(defaultValue?: T): Linq<T> {
    return this.Count() ? this : new Linq<T>([defaultValue]);
  }

  /**
   * Returns distinct elements from a sequence by using the default equality comparer to compare values.
   */
  public Distinct(): Linq<T> {
    return this.Where((value, index, iter) => (Tools.isObj(value) ? iter.findIndex(obj => Tools.equal(obj, value)) : iter.indexOf(value)) === index);
  }

  /**
   * Returns distinct elements from a sequence according to specified key selector.
   */
  public DistinctBy(keySelector: (key: T) => string | number): Linq<T> {
    const groups = this.GroupBy(keySelector);
    return Object.keys(groups).reduce((res, key) => {
      res.Add(groups[key][0]);
      return res;
    }, new Linq<T>());
  }

  /**
   * Returns the element at a specified index in a sequence.
   */
  public ElementAt(index: number): T {
    if (index < this.Count() && index >= 0) {
      return this._elements[index];
    } else {
      throw new Error('ArgumentOutOfRangeException: index is less than 0 or greater than or Tools.equal to the number of elements in source.');
    }
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   */
  public ElementAtOrDefault(index: number): T | null {
    return index < this.Count() && index >= 0 ? this._elements[index] : undefined;
  }

  /**
   * Produces the set difference of two sequences by using the default equality comparer to compare values.
   */
  public Except(source: Linq<T>): Linq<T> {
    return this.Where(x => !source.Contains(x));
  }

  /**
   * Returns the first element of a sequence.
   */
  public First(): T;
  public First(predicate: PredicateType<T>): T;
  public First(predicate?: PredicateType<T>): T {
    if (this.Count()) {
      return predicate ? this.Where(predicate).First() : this._elements[0];
    } else {
      throw new Error('InvalidOperationException: The source sequence is empty.');
    }
  }

  /**
   * Returns the first element of a sequence, or a default value if the sequence contains no elements.
   */
  public FirstOrDefault(): T;
  public FirstOrDefault(predicate: PredicateType<T>): T;
  public FirstOrDefault(predicate?: PredicateType<T>): T {
    return this.Count(predicate) ? this.First(predicate) : undefined;
  }

  /**
   * Performs the specified action on each element of the Linq<T>.
   */
  public ForEach(action: (value?: T, index?: number, list?: T[]) => any): void {
    return this._elements.forEach(action);
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   */
  public GroupBy<TOut, TResult = T>(grouper: (key: T) => TOut, mapper: (element: T) => TResult = val => val as unknown as TResult): { [key: string]: TResult[] } {
    const initialValue: TResult[] = [];
    const func = function (ac: GroupType<TOut>[], v: T) {
      const key = grouper(v);
      const existingGroup = new Linq<GroupType<TOut>>(ac).FirstOrDefault(x => Tools.equal(x.key, key));
      const mappedValue = mapper(v);

      if (existingGroup) {
        existingGroup.elements.push(mappedValue);
        existingGroup.count++;
      } else {
        const existingMap = { key: key, count: 1, elements: [mappedValue] };
        ac.push(existingMap);
      }
      return ac;
    };
    return this.Aggregate(func, initialValue);
  }

  /**
   * Correlates the elements of two sequences based on equality of keys and groups the results.
   * The default equality comparer is used to compare keys.
   */
  public GroupJoin<U, R>(list: Linq<U>, key1: (k: T) => any, key2: (k: U) => any, result: (first: T, second: Linq<U>) => R): Linq<R> {
    return this.Select(x =>
      result(
        x,
        list.Where(z => key1(x) === key2(z))
      )
    );
  }

  /**
   * Returns the index of the first occurence of an element in the List.
   */
  public IndexOf(element: T): number {
    return this._elements.indexOf(element);
  }

  /**
   * Inserts an element into the Linq<T> at the specified index.
   */
  public Insert(index: number, element: T): void | Error {
    if (index < 0 || index > this._elements.length) {
      throw new Error('Index is out of range.');
    }

    this._elements.splice(index, 0, element);
  }

  /**
   * Produces the set intersection of two sequences by using the default equality comparer to compare values.
   */
  public Intersect(source: Linq<T>): Linq<T> {
    return this.Where(x => source.Contains(x));
  }

  /**
   * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   */
  public Join<U, R>(list: Linq<U>, key1: (key: T) => any, key2: (key: U) => any, result: (first: T, second: U) => R): Linq<R> {
    return this.SelectMany(x => list.Where(y => key2(y) === key1(x)).Select(z => result(x, z)));
  }

  /**
   * Returns the last element of a sequence.
   */
  public Last(): T;
  public Last(predicate: PredicateType<T>): T;
  public Last(predicate?: PredicateType<T>): T {
    if (this.Count()) {
      return predicate ? this.Where(predicate).Last() : this._elements[this.Count() - 1];
    } else {
      throw Error('InvalidOperationException: The source sequence is empty.');
    }
  }

  /**
   * Returns the last element of a sequence, or a default value if the sequence contains no elements.
   */
  public LastOrDefault(): T;
  public LastOrDefault(predicate: PredicateType<T>): T;
  public LastOrDefault(predicate?: PredicateType<T>): T {
    return this.Count(predicate) ? this.Last(predicate) : undefined;
  }

  /**
   * Returns the maximum value in a generic sequence.
   */
  public Max(): number;
  public Max(selector: (value: T, index: number, array: T[]) => number): number;
  public Max(selector?: (value: T, index: number, array: T[]) => number): number {
    const id = x => x;
    return Math.max(...this._elements.map(selector || id));
  }

  /**
   * Returns the minimum value in a generic sequence.
   */
  public Min(): number;
  public Min(selector: (value: T, index: number, array: T[]) => number): number;
  public Min(selector?: (value: T, index: number, array: T[]) => number): number {
    const id = x => x;
    return Math.min(...this._elements.map(selector || id));
  }

  /**
   * Filters the elements of a sequence based on a specified type.
   */
  public OfType<U>(type: any): Linq<U> {
    let typeName;
    switch (type) {
      case Number:
        typeName = typeof 0;
        break;
      case String:
        typeName = typeof '';
        break;
      case Boolean:
        typeName = typeof true;
        break;
      case Function:
        typeName = typeof function () {}; // tslint:disable-line no-empty
        break;
      default:
        typeName = null;
        break;
    }
    return typeName === null ? this.Where(x => x instanceof type).Cast<U>() : this.Where(x => typeof x === typeName).Cast<U>();
  }

  /**
   * Sorts the elements of a sequence in ascending order according to a key.
   */
  public OrderBy(keySelector: (key: T) => any, comparer = Tools.keyComparer(keySelector, false)): Linq<T> {
    // tslint:disable-next-line: no-use-before-declare
    return new OrderedList<T>(Tools.cloneDeep(this._elements), comparer);
  }

  /**
   * Sorts the elements of a sequence in descending order according to a key.
   */
  public OrderByDescending(keySelector: (key: T) => any, comparer = Tools.keyComparer(keySelector, true)): Linq<T> {
    // tslint:disable-next-line: no-use-before-declare
    return new OrderedList<T>(Tools.cloneDeep(this._elements), comparer);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   */
  public ThenBy(keySelector: (key: T) => any): Linq<T> {
    return this.OrderBy(keySelector);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   */
  public ThenByDescending(keySelector: (key: T) => any): Linq<T> {
    return this.OrderByDescending(keySelector);
  }

  /**
   * Removes the first occurrence of a specific object from the Linq<T>.
   */
  public Remove(element: T): boolean {
    return this.IndexOf(element) !== -1 ? (this.RemoveAt(this.IndexOf(element)), true) : false;
  }

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   */
  public RemoveAll(predicate: PredicateType<T>): Linq<T> {
    return this.Where(Tools.negate(predicate));
  }

  /**
   * Removes the element at the specified index of the Linq<T>.
   */
  public RemoveAt(index: number): void {
    this._elements.splice(index, 1);
  }

  /**
   * Reverses the order of the elements in the entire Linq<T>.
   */
  public Reverse(): Linq<T> {
    return new Linq<T>(this._elements.reverse());
  }

  /**
   * Projects each element of a sequence into a new form.
   */
  public Select<TOut>(selector: (element: T, index: number) => TOut): Linq<TOut> {
    return new Linq<TOut>(this._elements.map(selector));
  }

  /**
   * Projects each element of a sequence to a List<any> and flattens the resulting sequences into one sequence.
   */
  public SelectMany<TOut extends Linq<any>>(selector: (element: T, index: number) => TOut): TOut {
    return this.Aggregate((ac, _, i) => (ac.AddRange(this.Select(selector).ElementAt(i).ToArray()), ac), new Linq<TOut>());
  }

  /**
   * Determines whether two sequences are Tools.equal by comparing the elements by using the default equality comparer for their type.
   */
  public SequenceEqual(list: Linq<T>): boolean {
    return this.All(e => list.Contains(e));
  }

  /**
   * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   */
  public Single(predicate?: PredicateType<T>): T {
    if (this.Count(predicate) !== 1) {
      throw new Error('The collection does not contain exactly one element.');
    } else {
      return this.First(predicate);
    }
  }

  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty;
   * this method throws an exception if there is more than one element in the sequence.
   */
  public SingleOrDefault(predicate?: PredicateType<T>): T {
    return this.Count(predicate) ? this.Single(predicate) : undefined;
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   */
  public Skip(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(Math.max(0, amount)));
  }

  /**
   * Omit the last specified number of elements in a sequence and then returns the remaining elements.
   */
  public SkipLast(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(0, -Math.max(0, amount)));
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   */
  public SkipWhile(predicate: PredicateType<T>): Linq<T> {
    return this.Skip(this.Aggregate(ac => (predicate(this.ElementAt(ac)) ? ++ac : ac), 0));
  }

  /**
   * Computes the sum of the sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public Sum(): number;
  public Sum(transform: (value?: T, index?: number, list?: T[]) => number): number;
  public Sum(transform?: (value?: T, index?: number, list?: T[]) => number): number {
    return transform ? this.Select(transform).Sum() : this.Aggregate((ac, v) => (ac += +v), 0);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   */
  public Take(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(0, Math.max(0, amount)));
  }

  /**
   * Returns a specified number of contiguous elements from the end of a sequence.
   */
  public TakeLast(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(-Math.max(0, amount)));
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   */
  public TakeWhile(predicate: PredicateType<T>): Linq<T> {
    return this.Take(this.Aggregate(ac => (predicate(this.ElementAt(ac)) ? ++ac : ac), 0));
  }

  /**
   * Copies the elements of the Linq<T> to a new array.
   */
  public ToArray(): T[] {
    return this._elements;
  }

  /**
   * Creates a Dictionary<TKey, TValue> from a Linq<T> according to a specified key selector function.
   */
  public ToDictionary<TKey>(key: (key: T) => TKey): Linq<{ Key: TKey; Value: T }>;
  public ToDictionary<TKey, TValue>(key: (key: T) => TKey, value: (value: T) => TValue): Linq<{ Key: TKey; Value: T | TValue }>;
  public ToDictionary<TKey, TValue>(key: (key: T) => TKey, value?: (value: T) => TValue): Linq<{ Key: TKey; Value: T | TValue }> {
    return this.Aggregate((dicc, v, i) => {
      dicc[this.Select(key).ElementAt(i).toString()] = value ? this.Select(value).ElementAt(i) : v;
      dicc.Add({
        Key: this.Select(key).ElementAt(i),
        Value: value ? this.Select(value).ElementAt(i) : v
      });
      return dicc;
    }, new Linq<{ Key: TKey; Value: T | TValue }>());
  }

  /**
   * Creates a Linq<T> from an Enumerable.Linq<T>.
   */
  public ToList(): Linq<T> {
    return this;
  }

  /**
   * Creates a Lookup<TKey, TElement> from an IEnumerable<T> according to specified key selector and element selector functions.
   */
  public ToLookup<TResult>(keySelector: (key: T) => string | number, elementSelector: (element: T) => TResult): { [key: string]: TResult[] } {
    return this.GroupBy(keySelector, elementSelector);
  }

  /**
   * Produces the set union of two sequences by using the default equality comparer.
   */
  public Union(list: Linq<T>): Linq<T> {
    return this.Concat(list).Distinct();
  }

  /**
   * Filters a sequence of values based on a predicate.
   */
  public Where(predicate: PredicateType<T>): Linq<T> {
    return new Linq<T>(this._elements.filter(predicate));
  }

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   */
  public Zip<U, TOut>(list: Linq<U>, result: (first: T, second: U) => TOut): Linq<TOut> {
    return list.Count() < this.Count() ? list.Select((x, y) => result(this.ElementAt(y), x)) : this.Select((x, y) => result(x, list.ElementAt(y)));
  }
}

/**
 * Represents a sorted sequence. The methods of this class are implemented by using deferred execution.
 * The immediate return value is an object that stores all the information that is required to perform the action.
 * The query represented by this method is not executed until the object is enumerated either by
 * calling its ToDictionary, ToLookup, ToList or ToArray methods
 */
class OrderedList<T> extends Linq<T> {
  constructor(elements: T[], private _comparer: (a: T, b: T) => number) {
    super(elements);
    this._elements.sort(this._comparer);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   * @override
   */
  public ThenBy(keySelector: (key: T) => any): Linq<T> {
    return new OrderedList(this._elements, Tools.composeComparers(this._comparer, Tools.keyComparer(keySelector, false)));
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   * @override
   */
  public ThenByDescending(keySelector: (key: T) => any): Linq<T> {
    return new OrderedList(this._elements, Tools.composeComparers(this._comparer, Tools.keyComparer(keySelector, true)));
  }
}

class Tools {
  /**
   * Checks if the argument passed is an object
   */
  static isObj = <T>(x: T): boolean => !!x && typeof x === 'object';

  /**
   * Determine if two objects are equal
   */
  static equal = <T, U>(a: T, b: U): boolean => Object.entries(a).every(([key, val]) => (Tools.isObj(val) ? Tools.equal(b[key], val) : b[key] === val));

  /**
   * Creates a function that negates the result of the predicate
   */
  static negate =
    <T>(pred: (...args: readonly T[]) => boolean): ((...args: readonly T[]) => boolean) =>
    (...args) =>
      !pred(...args);

  /**
   * Comparer helpers
   */
  static composeComparers =
    <T>(previousComparer: (a: T, b: T) => number, currentComparer: (a: T, b: T) => number): ((a: T, b: T) => number) =>
    (a: T, b: T) =>
      previousComparer(a, b) || currentComparer(a, b);

  static keyComparer =
    <T>(_keySelector: (key: T) => string, descending?: boolean): ((a: T, b: T) => number) =>
    (a: T, b: T) => {
      const sortKeyA = _keySelector(a);
      const sortKeyB = _keySelector(b);
      if (sortKeyA > sortKeyB) {
        return !descending ? 1 : -1;
      } else if (sortKeyA < sortKeyB) {
        return !descending ? -1 : 1;
      } else {
        return 0;
      }
    };

  /**
   * clone
   */
  static cloneDeep = <T>(obj: T) => {
    let copy, k, o, v;
    if (null === obj || 'object' !== typeof obj) {
      // Handle the 3 simple types, and null or undefined
      return obj;
    }
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      copy = function () {
        let j, len, results;
        results = [];
        for (j = 0, len = obj.length; j < len; j++) {
          o = obj[j];
          results.push(Tools.cloneDeep(o));
        }
        return results;
      }.call(this);
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (k in obj) {
        v = obj[k];
        if (obj.hasOwnProperty(k)) {
          copy[k] = Tools.cloneDeep(v);
        }
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  };
}

export default Linq;
