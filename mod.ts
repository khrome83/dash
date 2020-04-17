type Nullable<T> = T | null;
type Identifier = string | number;

/**
 * The main Dash cache class
 */
export class Cache {
  #limit: number;
  #entries: Map<Identifier, any>;
  /**
   * Creates an instance of Cache
   * @param cacheLimit The max number of items the cache can store
   */
  constructor(cacheLimit?: number) {
    this.#limit = cacheLimit ?? 10000;
    this.#entries = new Map();
  }
  /**
   * Set's a key:value pair in the cache
   * @param key The key to store the value under
   * @param data The value to store in the cache
   */
  set(key: Identifier, data: any): void {
    if (this.#entries.size >= this.#limit) {
      this.#entries.delete(this.#entries.keys().next().value);
      this.#entries.set(key, data);
    } else this.#entries.set(key, data);
  }
  /**
   * Attemps to retrieve a value from the cache
   * @param key The key to get a value from the cache
   */
  get(key: Identifier): Nullable<any> {
    if (this.#entries.has(key)) {
      this.#entries.set(key, this.#entries.get(key));
      return this.#entries.get(key);
    } else return null;
  }
  /**
   * Returns the internal cache limit
   */
  get limit(): number {
    return this.#limit;
  }
  /**
   * Returns the current amount of items in the cache
   */
  get size(): number {
    return this.#entries.size;
  }
}
