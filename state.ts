import { State, Identifier, Nullable } from "./util.ts";
import { CacheOptions } from "./mod.ts";

const decoder = new TextDecoder("utf-8");

export class CacheState {
  #internal: State;
  #logical: boolean;
  #threshold: number;
  #increase: number;
  constructor(opts?: CacheOptions) {
    this.#logical = opts?.logical ?? false;
    this.#threshold = opts?.threshold ?? 10;
    this.#increase = opts?.increase ?? 10;
    this.#internal = {
      limit: opts?.limit ?? 10000,
      oldLimit: opts?.logical ? opts.limit ?? 10000 : undefined,
      entries: new Map(),
      overwrites: 0,
    };
  }
  addItem(key: Identifier, value: any): void {
    if (this.#internal.entries.size >= this.#internal.limit) {
      if (this.#logical) {
        this.#internal.overwrites += 1;
        if (this.#internal.overwrites >= this.#threshold) {
          this.#internal.overwrites = 0;
          this.#internal.limit += this.#increase;
        }
      }
      this.#internal.entries.delete(this.#internal.entries.keys().next().value);
      this.#internal.entries.set(key, value);
    } else this.#internal.entries.set(key, value);
  }
  getItem(key: Identifier): Nullable<any> {
    if (!this.#internal.entries.has(key)) return null;
    this.#internal.entries.set(key, this.#internal.entries.get(key));
    const data = this.#internal.entries.get(key);
    if (data instanceof Uint8Array) {
      return JSON.parse(decoder.decode(data));
    } else return data;
  }
  reset(): void {
    this.#internal.entries.clear();
    if (this.#logical) {
      this.#internal.overwrites = 0;
      if (this.#internal.oldLimit) {
        this.#internal.limit = this.#internal.oldLimit;
      }
    }
  }
  get entries(): Map<Identifier, any> {
    return this.#internal.entries;
  }
  get values(): { limit: number; overwrites: number } {
    return {
      limit: this.#internal.limit,
      overwrites: this.#internal.overwrites,
    };
  }
}
