type Nullable<T> = T | null;
type Identifier = string | number;

/**
 * The main Dash cache class
 * @export
 * @class Cache
 */
export class Cache {
  #limit: number;
  #entries: Map<Identifier, any>;
  /**
   * Creates an instance of Cache
   * @param {number} cacheLimit
   * @memberof Cache
   */
  constructor(cacheLimit: number) {
    this.#limit = cacheLimit;
    this.#entries = new Map();
  }
  /**
   * Set's a key:value pair in the cache
   * @param {Identifier} key
   * @param {*} data
   * @memberof Cache
   */
  set(key: Identifier, data: any): void {
    if (this.#entries.size >= this.#limit) {
      this.#entries.delete(this.#entries.keys().next().value);
      this.#entries.set(key, data);
    } else this.#entries.set(key, data);
  }
  /**
   * Attemps to retrieve a value from the cache
   * @param {Identifier} key
   * @returns {Nullable<any>}
   * @memberof Cache
   */
  get(key: Identifier): Nullable<any> {
    if (this.#entries.has(key)) {
      this.#entries.set(key, this.#entries.get(key));
      return this.#entries.get(key);
    } else return null;
  }
  /**
   * Returns the internal cache limit
   * @readonly
   * @type {number}
   * @memberof Cache
   */
  get limit(): number {
    return this.#limit;
  }
  /**
   * Returns the current amount of items in the cache
   * @readonly
   * @type {number}
   * @memberof Cache
   */
  get size(): number {
    return this.#entries.size;
  }
}
