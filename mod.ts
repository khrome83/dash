import { isSerializable, Nullable, Identifier, serialize } from "./util.ts";
const decoder = new TextDecoder("utf-8");

/**
 * The options for the cache class
 */
export interface CacheOptions {
  /**
   * The max number of items the cache can store (defaults to 10,000)
   */
  limit?: number;
  /**
   * Wether to serialize json-parsable data
   */
  serialize?: boolean;
  /**
   * Use a logical limiting system
   */
  logical?: boolean;
}

interface CacheProperties {
  limit: number;
  size: number;
  overwrites: number;
}

/**
 * The main Dash cache class
 */
export class Cache {
  #limit: number;
  #entries: Map<Identifier, any>;
  #serialize: boolean;
  #logical: boolean;
  #overwrites: number;
  #originalLimit: number | undefined;
  /**
   * Creates an instance of Cache
   * @param options The configuration for the cache
   */
  constructor(options?: CacheOptions) {
    this.#logical = options?.logical ?? false;
    this.#serialize = options?.serialize ?? false;
    this.#limit = options?.limit ?? 10000;
    if (this.#logical) this.#originalLimit = options?.limit ?? 10000;
    this.#entries = new Map();
    this.#overwrites = 0;
  }
  /**
   * Set's a key:value pair in the cache
   * @param key The key to store the value under
   * @param data The value to store in the cache
   */
  set(key: Identifier, data: any): void {
    let serializedData = data;
    if (this.#serialize && isSerializable(data)) {
      serializedData = serialize(data);
    }
    if (this.#entries.size >= this.#limit) {
      if (this.#logical) {
        this.#overwrites += 1;
        if (this.#overwrites >= 10) {
          this.#overwrites = 0;
          this.#limit += 10;
        }
      }
      this.#entries.delete(this.#entries.keys().next().value);
      this.#entries.set(key, serializedData);
    } else this.#entries.set(key, serializedData);
  }
  /**
   * Attemps to retrieve a value from the cache
   * @param key The key to get a value from the cache
   */
  get(key: Identifier): Nullable<any> {
    if (!this.#entries.has(key)) return null;
    this.#entries.set(key, this.#entries.get(key));
    const data = this.#entries.get(key);
    if (data instanceof Uint8Array) {
      return JSON.parse(decoder.decode(data));
    } else return data;
  }
  /**
   * Removes all items from the cache
   */
  reset(): void {
    this.#entries.clear();
    if (this.#logical) {
      this.#overwrites = 0;
      if (this.#originalLimit) this.#limit = this.#originalLimit;
    }
  }
  /**
   * Returns the elements of the cache as an Array of pairs
   */
  get array(): Array<[Identifier, any]> {
    let elements = [];
    for (let item of this.#entries.entries()) {
      elements.push(item);
    }
    return elements;
  }
  /**
   * The current internal values of the cache
   */
  get properties(): CacheProperties {
    return {
      limit: this.#limit,
      size: this.#entries.size,
      overwrites: this.#overwrites,
    };
  }
  /**
   * Returns the internal map of cache entries
   */
  get entries(): Map<Identifier, any> {
    return this.#entries;
  }
}
