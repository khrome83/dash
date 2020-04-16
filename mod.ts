interface CacheEntry {
  identifier: string | number;
  data: Uint8Array;
}

class Cache {
  private limit: number;
  private entries: CacheEntry[];
  constructor(cacheLimit: number) {
    this.limit = cacheLimit;
    this.entries = [];
  }
}
