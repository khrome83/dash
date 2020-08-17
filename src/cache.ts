import {
  Nullable,
  Identifier,
  serialize,
} from "./util.ts";

import { CacheState } from "./state.ts";

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
  /**
   * The threshold in which the cache will resize its limit in logical mode
   */
  threshold?: number;
  /**
   * The amount the cache will increase its limit after the threshold is hit
   */
  increase?: number;
}

/**
 * The current internal values of the cache
 */
export interface CacheProperties {
  /** The current cache size limit */
  limit: number;
  /** The current size of the cache */
  size: number;
  /** The current number of entry overwrites */
  overwrites: number;
}

/**
 * The main Dash cache class
 */
export class Cache {
  #serialize: boolean;
  #state: CacheState;
  /**
   * Creates an instance of Cache
   * @param options The configuration for the cache
   */
  constructor(options?: CacheOptions) {
    this.#serialize = options?.serialize ?? false;
    this.#state = new CacheState(options);
  }
  /**
   * Set's a key:value pair in the cache
   * @param key The key to store the value under
   * @param data The value to store in the cache
   */
  set(key: Identifier, data: any): void {
    let serializedData = this.#serialize ? serialize(data) : data;
    this.#state.addItem(key, serializedData);
  }
  /**
   * Attemps to retrieve a value from the cache
   * @param key The key to get a value from the cache
   */
  get = (key: Identifier): Nullable<any> => this.#state.getItem(key);
  /**
   * Check if item exists in cache
   * @param key The key to get a value from the cache
   */
  has = (key: Identifier): Boolean => this.#state.hasItem(key);
  /**
   * Removes individual item from cache
   */
  remove = (key: Identifier): void => this.#state.removeItem(key);

  /**
   * Removes all items from the cache
   */
  reset = (): void => this.#state.reset();
  /**
   * Returns the elements of the cache as an Array of pairs
   */
  toArray(): Array<[Identifier, any]> {
    let elements = [];
    for (let item of this.#state.entries.entries()) {
      elements.push(item);
    }
    return elements;
  }
  /**
   * Returns the internal map of cache entries
   */
  get entries(): Map<Identifier, any> {
    return this.#state.entries;
  }
  /**
   * The current internal values of the cache
   */
  get properties(): CacheProperties {
    return {
      size: this.#state.entries.size,
      ...this.#state.values,
    };
  }
}
