import {
  isSerializable,
  Nullable,
  Identifier,
  serialize,
  CacheState,
} from "./util.ts";

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
  #logical: boolean;
  #state: CacheState;
  /**
   * Creates an instance of Cache
   * @param options The configuration for the cache
   */
  constructor(options?: CacheOptions) {
    this.#logical = options?.logical ?? false;
    this.#serialize = options?.serialize ?? false;
    this.#state = {
      entries: new Map(),
      limit: options?.limit ?? 10000,
      oldLimit: options?.limit ?? 10000,
      overwrites: 0,
    };
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
    if (this.#state.entries.size >= this.#state.limit) {
      if (this.#logical) {
        this.#state.overwrites += 1;
        if (this.#state.overwrites >= 10) {
          this.#state.overwrites = 0;
          this.#state.limit += 10;
        }
      }
      this.#state.entries.delete(this.#state.entries.keys().next().value);
      this.#state.entries.set(key, serializedData);
    } else this.#state.entries.set(key, serializedData);
  }
  /**
   * Attemps to retrieve a value from the cache
   * @param key The key to get a value from the cache
   */
  get(key: Identifier): Nullable<any> {
    if (!this.#state.entries.has(key)) return null;
    this.#state.entries.set(key, this.#state.entries.get(key));
    const data = this.#state.entries.get(key);
    if (data instanceof Uint8Array) {
      return JSON.parse(decoder.decode(data));
    } else return data;
  }
  /**
   * Removes all items from the cache
   */
  reset(): void {
    this.#state.entries.clear();
    if (this.#logical) {
      this.#state.overwrites = 0;
      if (this.#state.oldLimit) this.#state.limit = this.#state.oldLimit;
    }
  }
  /**
   * Returns the elements of the cache as an Array of pairs
   */
  get array(): Array<[Identifier, any]> {
    let elements = [];
    for (let item of this.#state.entries.entries()) {
      elements.push(item);
    }
    return elements;
  }
  /**
   * The current internal values of the cache
   */
  get properties(): CacheProperties {
    return {
      limit: this.#state.limit,
      size: this.#state.entries.size,
      overwrites: this.#state.overwrites,
    };
  }
  /**
   * Returns the internal map of cache entries
   */
  get entries(): Map<Identifier, any> {
    return this.#state.entries;
  }
}
