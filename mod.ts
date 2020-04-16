interface CacheEntry<type> {
  key: string | number;
  data: type;
}

type Nullable<T> = T | null;

class Cache {
  #limit: number;
  #entries: CacheEntry<any>[];
  constructor(cacheLimit: number) {
    this.#limit = cacheLimit;
    this.#entries = [];
  }
  set<T>(key: string | number, data: T): void {
    const entry: CacheEntry<T> = { key, data };
    if (this.#entries.length >= this.#limit) {
      this.#entries.shift();
      this.#entries.push(entry);
    } else this.#entries.push(entry);
  }
  get(key: string | number): Nullable<any> {
    const entry = this.#entries.find((e) => e.key == key);
    return entry?.data ?? null;
  }
}
