type PredicateType<T> = (value?: T, index?: number, list?: T[]) => boolean;
interface GroupType<T> {
  key?: any;
  count?: number;
  elements?: T[];
}

/**
 * LINQ to TypeScript (Language Integrated Query)
 */
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
  public add(element: T): void {
    this._elements.push(element);
  }

  /**
   * Appends an object to the end of the Linq<T>.
   */
  public append(element: T): void {
    this.add(element);
  }

  /**
   * Add an object to the start of the Linq<T>.
   */
  public prepend(element: T): void {
    this._elements.unshift(element);
  }

  /**
   * Adds the elements of the specified collection to the end of the Linq<T>.
   */
  public addRange(elements: T[]): void {
    this._elements.push(...elements);
  }

  /**
   * Applies an accumulator function over a sequence.
   */
  public aggregate<U>(accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any, initialValue?: U): any {
    return this._elements.reduce(accumulator, initialValue);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  public all(predicate: PredicateType<T>): boolean {
    return this._elements.every(predicate);
  }

  /**
   * Determines whether a sequence contains any elements.
   */
  public any(): boolean;
  public any(predicate: PredicateType<T>): boolean;
  public any(predicate?: PredicateType<T>): boolean {
    return predicate ? this._elements.some(predicate) : this._elements.length > 0;
  }

  /**
   * Computes the average of a sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public average(): number;
  public average(transform: (value?: T, index?: number, list?: T[]) => any): number;
  public average(transform?: (value?: T, index?: number, list?: T[]) => any): number {
    return Tools.calcNumDiv(this.sum(transform), this.count());
  }

  /**
   * Casts the elements of a sequence to the specified type.
   */
  public cast<U>(): Linq<U> {
    return new Linq<U>(this._elements as any);
  }

  /**
   * Removes all elements from the Linq<T>.
   */
  public clear(): void {
    this._elements.length = 0;
  }

  /**
   * Concatenates two sequences.
   */
  public concat(list: Linq<T>): Linq<T> {
    return new Linq<T>(this._elements.concat(list.toArray()));
  }

  /**
   * Determines whether an element is in the Linq<T>.
   */
  public contains(element: T): boolean {
    return this.any(x => x === element);
  }

  /**
   * Returns the number of elements in a sequence.
   */
  public count(): number;
  public count(predicate: PredicateType<T>): number;
  public count(predicate?: PredicateType<T>): number {
    return predicate ? this.where(predicate).count() : this._elements.length;
  }

  /**
   * Returns the elements of the specified sequence or the type parameter's default value
   * in a singleton collection if the sequence is empty.
   */
  public defaultIfEmpty(defaultValue?: T): Linq<T> {
    return this.count() ? this : new Linq<T>([defaultValue]);
  }

  /**
   * Returns distinct elements from a sequence by using the default equality comparer to compare values.
   */
  public distinct(): Linq<T> {
    return this.where((value, index, iter) => (Tools.isObject(value) ? iter.findIndex(obj => Tools.equal(obj, value)) : iter.indexOf(value)) === index);
  }

  /**
   * Returns distinct elements from a sequence according to specified key selector.
   */
  public distinctBy<TOut>(keySelector: (key: T) => TOut): Linq<T> {
    const groups: any = this.groupBy(keySelector);
    const func = function (res: Linq<T>, key: T) {
      const curr = new Linq<GroupType<T>>(groups).firstOrDefault(x => Tools.equal(x.key, key));
      res.add(curr.elements[0]);
      return res;
    };
    return new Linq<GroupType<T>>(groups)
      .select(x => x.key)
      .toArray()
      .reduce(func, new Linq<T>());
  }

  /**
   * Returns distinct elements from a sequence by using the default equality comparer to compare values and this.select method.
   */
  public distinctMap<TOut>(): Linq<T | TOut>;
  public distinctMap<TOut>(selector: (element: T, index: number) => TOut): Linq<T | TOut>;
  public distinctMap<TOut>(selector?: (element: T, index: number) => TOut): Linq<T | TOut> {
    return selector ? this.select(selector).distinct() : this.distinct();
  }

  /**
   * Returns the element at a specified index in a sequence.
   */
  public elementAt(index: number): T {
    if (index < this.count() && index >= 0) {
      return this._elements[index];
    } else {
      throw new Error('ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.');
    }
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   */
  public elementAtOrDefault(index: number): T | null {
    return index < this.count() && index >= 0 ? this._elements[index] : undefined;
  }

  /**
   * Produces the set difference of two sequences by using the default equality comparer to compare values.
   */
  public except(source: Linq<T>): Linq<T> {
    return this.where(x => !source.contains(x));
  }

  /**
   * Returns the first element of a sequence.
   */
  public first(): T;
  public first(predicate: PredicateType<T>): T;
  public first(predicate?: PredicateType<T>): T {
    if (this.count()) {
      return predicate ? this.where(predicate).first() : this._elements[0];
    } else {
      throw new Error('InvalidOperationException: The source sequence is empty.');
    }
  }

  /**
   * Returns the first element of a sequence, or a default value if the sequence contains no elements.
   */
  public firstOrDefault(): T;
  public firstOrDefault(predicate: PredicateType<T>): T;
  public firstOrDefault(predicate?: PredicateType<T>): T {
    return this.count(predicate) ? this.first(predicate) : undefined;
  }

  /**
   * Performs the specified action on each element of the Linq<T>.
   */
  public forEach(action: (value?: T, index?: number, list?: T[]) => any): void {
    return this._elements.forEach(action);
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   */
  public groupBy<TOut, TResult = T>(grouper: (key: T) => TOut, mapper: (element: T) => TResult = val => val as unknown as TResult): TResult[] {
    const groupMap = new Map();
    for (let element of this._elements) {
      const key = Tools.getHash(grouper(element));
      const mappedValue = mapper(element);

      if (!groupMap.has(key)) {
        groupMap.set(key, { key: grouper(element), count: 0, elements: [] });
      }

      const group = groupMap.get(key);
      group.elements.push(mappedValue);
      group.count++;
    }
    return Array.from(groupMap.values());
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * a little data.
   */
  public groupByMini<TOut, TResult = T>(grouper: (key: T) => TOut, mapper: (element: T) => TResult = val => val as unknown as TResult): TResult[] {
    const initialValue: TResult[] = [];
    const func = function (ac: GroupType<TResult>[], v: T) {
      const key = grouper(v);
      const existingGroup = new Linq<GroupType<TResult>>(ac).firstOrDefault(x => Tools.equal(x.key, key));
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
    return this.aggregate(func, initialValue);
  }

  /**
   * Correlates the elements of two sequences based on equality of keys and groups the results.
   * The default equality comparer is used to compare keys.
   */
  public groupJoin<U, R>(list: Linq<U>, key1: (k: T) => any, key2: (k: U) => any, result: (first: T, second: Linq<U>) => R): Linq<R> {
    return this.select(x =>
      result(
        x,
        list.where(z => key1(x) === key2(z))
      )
    );
  }

  /**
   * Returns the index of the first occurence of an element in the List.
   */
  public indexOf(element: T): number {
    return this._elements.indexOf(element);
  }

  /**
   * Inserts an element into the Linq<T> at the specified index.
   */
  public insert(index: number, element: T): void | Error {
    if (index < 0 || index > this._elements.length) {
      throw new Error('Index is out of range.');
    }

    this._elements.splice(index, 0, element);
  }

  /**
   * Produces the set intersection of two sequences by using the default equality comparer to compare values.
   */
  public intersect(source: Linq<T>): Linq<T> {
    return this.where(x => source.contains(x));
  }

  /**
   * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   */
  public join<U, R>(list: Linq<U>, key1: (key: T) => any, key2: (key: U) => any, result: (first: T, second: U) => R): Linq<R> {
    return this.selectMany(x => list.where(y => key2(y) === key1(x)).select(z => result(x, z)));
  }

  /**
   * Returns the last element of a sequence.
   */
  public last(): T;
  public last(predicate: PredicateType<T>): T;
  public last(predicate?: PredicateType<T>): T {
    if (this.count()) {
      return predicate ? this.where(predicate).last() : this._elements[this.count() - 1];
    } else {
      throw Error('InvalidOperationException: The source sequence is empty.');
    }
  }

  /**
   * Returns the last element of a sequence, or a default value if the sequence contains no elements.
   */
  public lastOrDefault(): T;
  public lastOrDefault(predicate: PredicateType<T>): T;
  public lastOrDefault(predicate?: PredicateType<T>): T {
    return this.count(predicate) ? this.last(predicate) : undefined;
  }

  /**
   * Returns the maximum value in a generic sequence.
   */
  public max(): number;
  public max(selector: (value: T, index: number, array: T[]) => number): number;
  public max(selector?: (value: T, index: number, array: T[]) => number): number {
    const id = x => x;
    return Math.max(...this._elements.map(selector || id));
  }

  /**
   * Returns the minimum value in a generic sequence.
   */
  public min(): number;
  public min(selector: (value: T, index: number, array: T[]) => number): number;
  public min(selector?: (value: T, index: number, array: T[]) => number): number {
    const id = x => x;
    return Math.min(...this._elements.map(selector || id));
  }

  /**
   * Filters the elements of a sequence based on a specified type.
   */
  public ofType<U>(type: any): Linq<U> {
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
    return typeName === null ? this.where(x => x instanceof type).cast<U>() : this.where(x => typeof x === typeName).cast<U>();
  }

  /**
   * Sorts the elements of a sequence in ascending order according to a key.
   */
  public orderBy(keySelector: (key: T) => any, comparer = Tools.keyComparer(keySelector, false)): Linq<T> {
    // tslint:disable-next-line: no-use-before-declare
    return new OrderedList<T>(Tools.arrayMap(this._elements), comparer);
  }

  /**
   * Sorts the elements of a sequence in descending order according to a key.
   */
  public orderByDescending(keySelector: (key: T) => any, comparer = Tools.keyComparer(keySelector, true)): Linq<T> {
    // tslint:disable-next-line: no-use-before-declare
    return new OrderedList<T>(Tools.arrayMap(this._elements), comparer);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   */
  public thenBy(keySelector: (key: T) => any): Linq<T> {
    return this.orderBy(keySelector);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   */
  public thenByDescending(keySelector: (key: T) => any): Linq<T> {
    return this.orderByDescending(keySelector);
  }

  /**
   * Removes the first occurrence of a specific object from the Linq<T>.
   */
  public remove(element: T): boolean {
    return this.indexOf(element) !== -1 ? (this.removeAt(this.indexOf(element)), true) : false;
  }

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   */
  public removeAll(predicate: PredicateType<T>): Linq<T> {
    return this.where(Tools.negate(predicate));
  }

  /**
   * Removes the element at the specified index of the Linq<T>.
   */
  public removeAt(index: number): void {
    this._elements.splice(index, 1);
  }

  /**
   * Reverses the order of the elements in the entire Linq<T>.
   */
  public reverse(): Linq<T> {
    return new Linq<T>(this._elements.reverse());
  }

  /**
   * Projects each element of a sequence into a new form.
   */
  public select<TOut>(selector: (element: T, index: number) => TOut): Linq<TOut> {
    return new Linq<TOut>(this._elements.map(selector));
  }

  /**
   * Projects each element of a sequence to a List<any> and flattens the resulting sequences into one sequence.
   */
  public selectMany<TOut extends Linq<any>>(selector: (element: T, index: number) => TOut): TOut {
    return this.aggregate((ac, _, i) => (ac.addRange(this.select(selector).elementAt(i).toArray()), ac), new Linq<TOut>());
  }

  /**
   * Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
   */
  public sequenceEqual(list: Linq<T>): boolean {
    return this.all(e => list.contains(e));
  }

  /**
   * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   */
  public single(predicate?: PredicateType<T>): T {
    if (this.count(predicate) !== 1) {
      throw new Error('The collection does not contain exactly one element.');
    } else {
      return this.first(predicate);
    }
  }

  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty;
   * this method throws an exception if there is more than one element in the sequence.
   */
  public singleOrDefault(predicate?: PredicateType<T>): T {
    return this.count(predicate) ? this.single(predicate) : undefined;
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   */
  public skip(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(Math.max(0, amount)));
  }

  /**
   * Omit the last specified number of elements in a sequence and then returns the remaining elements.
   */
  public skipLast(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(0, -Math.max(0, amount)));
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   */
  public skipWhile(predicate: PredicateType<T>): Linq<T> {
    return this.skip(this.aggregate(ac => (predicate(this.elementAt(ac)) ? ++ac : ac), 0));
  }

  /**
   * Computes the sum of the sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public sum(): number;
  public sum(transform: (value?: T, index?: number, list?: T[]) => number): number;
  public sum(transform?: (value?: T, index?: number, list?: T[]) => number): number {
    return transform ? this.select(transform).sum() : this.aggregate((ac, v) => (ac = Tools.calcNum(ac, +v)), 0);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   */
  public take(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(0, Math.max(0, amount)));
  }

  /**
   * Returns a specified number of contiguous elements from the end of a sequence.
   */
  public takeLast(amount: number): Linq<T> {
    return new Linq<T>(this._elements.slice(-Math.max(0, amount)));
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   */
  public takeWhile(predicate: PredicateType<T>): Linq<T> {
    return this.take(this.aggregate(ac => (predicate(this.elementAt(ac)) ? ++ac : ac), 0));
  }

  /**
   * Copies the elements of the Linq<T> to a new array.
   */
  public toArray(): T[] {
    return this._elements;
  }

  /**
   * Creates a Dictionary<TKey, TValue> from a Linq<T> according to a specified key selector function.
   */
  public toDictionary<TKey>(key: (key: T) => TKey): Linq<{ Key: TKey; Value: T }>;
  public toDictionary<TKey, TValue>(key: (key: T) => TKey, value: (value: T) => TValue): Linq<{ Key: TKey; Value: T | TValue }>;
  public toDictionary<TKey, TValue>(key: (key: T) => TKey, value?: (value: T) => TValue): Linq<{ Key: TKey; Value: T | TValue }> {
    return this.aggregate((dicc, v, i) => {
      // dicc[this.select(key).elementAt(i).toString()] = value ? this.select(value).elementAt(i) : v;
      dicc.add({
        Key: this.select(key).elementAt(i),
        Value: value ? this.select(value).elementAt(i) : v,
      });
      return dicc;
    }, new Linq<{ Key: TKey; Value: T | TValue }>());
  }

  /**
   * Creates a Linq<T> from an Enumerable.Linq<T>.
   */
  public toList(): Linq<T> {
    return this;
  }

  /**
   * Creates a Lookup<TKey, TElement> from an IEnumerable<T> according to specified key selector and element selector functions.
   */
  public toLookup<TResult>(keySelector: (key: T) => string | number, elementSelector: (element: T) => TResult): TResult[] {
    return this.groupBy(keySelector, elementSelector);
  }

  /**
   * Produces the set union of two sequences by using the default equality comparer.
   */
  public union(list: Linq<T>): Linq<T> {
    return this.concat(list).distinct();
  }

  /**
   * Filters a sequence of values based on a predicate.
   */
  public where(predicate: PredicateType<T>): Linq<T> {
    return new Linq<T>(this._elements.filter(predicate));
  }

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   */
  public zip<U, TOut>(list: Linq<U>, result: (first: T, second: U) => TOut): Linq<TOut> {
    return list.count() < this.count() ? list.select((x, y) => result(this.elementAt(y), x)) : this.select((x, y) => result(x, list.elementAt(y)));
  }

  /**
   * Determine if two objects are equal.
   */
  // public equals<T, U>(param1: T | any, param2: U | any): boolean {
  //   return Tools.equal(param1, param2);
  // }
}

/**
 * Represents a sorted sequence. The methods of this class are implemented by using deferred execution.
 * The immediate return value is an object that stores all the information that is required to perform the action.
 * The query represented by this method is not executed until the object is enumerated either by
 * calling its toDictionary, toLookup, toList or toArray methods
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
  public thenBy(keySelector: (key: T) => any): Linq<T> {
    return new OrderedList(this._elements, Tools.composeComparers(this._comparer, Tools.keyComparer(keySelector, false)));
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   * @override
   */
  public thenByDescending(keySelector: (key: T) => any): Linq<T> {
    return new OrderedList(this._elements, Tools.composeComparers(this._comparer, Tools.keyComparer(keySelector, true)));
  }
}

/**
 * Tool method
 */
class Tools {
  /**
   * Checks if the argument passed is an object
   */
  static isObject = <T>(x: T): boolean => !!x && typeof x === 'object';

  /**
   * Determine if two objects are equal
   */
  static equal = <T, U>(a: T | any, b: U | any): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (!this.isObject(a) || !this.isObject(b)) return a === b;

    const types = [a, b].map(x => x.constructor);
    if (types[0] !== types[1]) return false;

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    if (a instanceof RegExp && b instanceof RegExp) {
      return a.toString() === b.toString();
    }

    const entriesA = Object.entries(a);
    const entriesB = Object.entries(b);
    if (entriesA.length !== entriesB.length) return false;

    const Fn = (entries, _b): boolean => entries.every(([key, val]) => (this.isObject(val) ? this.equal(_b[key], val) : _b[key] === val));

    return Fn(entriesA, b) && Fn(entriesB, a);
  };

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

  /**
   * Key comparer
   */
  static keyComparer = <T>(_keySelector: (key: T) => string, descending?: boolean): ((a: T, b: T) => number) => {
    // common comparer
    const _comparer = (sortKeyA, sortKeyB): number => {
      if (sortKeyA > sortKeyB) {
        return !descending ? 1 : -1;
      } else if (sortKeyA < sortKeyB) {
        return !descending ? -1 : 1;
      } else {
        return 0;
      }
    };

    // string comparer
    const _stringComparer = (sortKeyA, sortKeyB): number => {
      if (sortKeyA.localeCompare(sortKeyB) > 0) {
        return !descending ? 1 : -1;
      } else if (sortKeyB.localeCompare(sortKeyA) > 0) {
        return !descending ? -1 : 1;
      } else {
        return 0;
      }
    };

    return (a: T, b: T) => {
      const sortKeyA = _keySelector(a);
      const sortKeyB = _keySelector(b);

      if (this.isString(sortKeyA) && this.isString(sortKeyB)) {
        return _stringComparer(sortKeyA, sortKeyB);
      }
      return _comparer(sortKeyA, sortKeyB);
    };
  };

  /**
   * Number calculate addition
   */
  static calcNum = (num1: number, num2: number): number => {
    if (!this.isNum(num1) || !this.isNum(num2)) return 0;
    const { mult, place } = this.calcMultiple(num1, num2);
    return Number(((num1 * mult + num2 * mult) / mult).toFixed(place));
  };

  /**
   * Number calculate division
   */
  static calcNumDiv = (num1: number, num2: number): number => {
    if (!this.isNum(num1) || !this.isNum(num2)) return 0;
    const { mult } = this.calcMultiple(num1, num2);
    return (num1 * mult) / (num2 * mult);
  };

  /**
   * Check number
   */
  static isNum = (args): boolean => typeof args === 'number' && !isNaN(args);

  /**
   * Check string
   */
  static isString = (args): boolean => typeof args === 'string' && args.constructor === String;

  /**
   * Check array
   */
  static isArray = (array): boolean => Array.isArray(array);

  /**
   * Calculation multiple
   */
  static calcMultiple = (num1: number, num2: number): any => {
    const arrNum1 = num1.toString().split('.');
    const arrNum2 = num2.toString().split('.');
    const sq1 = arrNum1.length > 1 ? arrNum1[1].length : 0;
    const sq2 = arrNum2.length > 1 ? arrNum2[1].length : 0;
    const mult = Math.pow(10, Math.max(sq1, sq2));
    const place = sq1 >= sq2 ? sq1 : sq2;
    return { mult, place };
  };

  /**
   * Build array new reference
   */
  static arrayMap = <T>(array): T => {
    if (!this.isArray(array)) {
      return array;
    }
    return array.map(x => x);
  };

  /**
   * Clone data
   */
  static cloneDeep = <T, Y>(obj: T): T | Y => {
    if (typeof structuredClone === 'function') {
      return structuredClone(obj);
    }

    let result;
    // Handle the 3 simple types, and null or undefined
    if (null === obj || 'object' !== typeof obj) {
      return obj;
    }
    // Handle Date
    if (obj instanceof Date) {
      result = new Date();
      result.setTime(obj.getTime());
      return result;
    }
    // Handle RegExp
    if (obj instanceof RegExp) {
      result = obj;
      return result;
    }
    // Handle Array
    if (obj instanceof Array) {
      result = [];
      for (let i in obj) {
        result.push(this.cloneDeep(obj[i]));
      }
      return result;
    }
    // Handle Object
    if (obj instanceof Object) {
      result = {};
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          result[i] = this.cloneDeep(obj[i]);
        }
      }
      return result;
    }
    throw new Error("Unable to copy param! Its type isn't supported.");
  };

  /**
   * Generate Hash
   */
  static getHash = <T>(obj: T): String => {
    let hashValue = '';

    const typeOf = (obj): String => {
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    };

    const generateHash = (value): String => {
      const type = typeOf(value);
      switch (type) {
        case 'object':
          const keys = Object.keys(value).sort();
          keys.forEach(key => {
            hashValue += `${key}:${generateHash(value[key])};`;
          });
          break;
        case 'array':
          value.forEach(item => {
            hashValue += `${generateHash(item)},`;
          });
          break;
        case 'boolean':
          hashValue += `boolean<>_<>_<>${value.toString()}`;
          break;
        case 'null':
          hashValue += 'null<>_<>_<>';
          break;
        case 'undefined':
          hashValue += 'undefined<>_<>_<>';
          break;
        default:
          hashValue += value ? value.toString() : '';
          break;
      }
      return hashValue;
    };
    return generateHash(obj);
  };
}

export default Linq;
