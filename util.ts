/**
 * Check if data is JSON serializable
 * @param value The value to check
 */
export function isSerializable(value: any): boolean {
  if (typeof value == "boolean") return true;
  else if (typeof value == "number") return true;
  else if (typeof value == "string") return true;
  else if (value instanceof Object) return true;
  else return false;
}

const encoder = new TextEncoder();
/**
 * Attempts to serialize data into a JSON format
 * @param data The data to serialize
 */
export function serialize(data: any): Uint8Array {
  const dataString = JSON.stringify(data);
  return encoder.encode(dataString);
}

export type Nullable<T> = T | null;
export type Identifier = string | number;

export interface CacheState {
  limit: number;
  entries: Map<Identifier, any>;
  overwrites: number;
  oldLimit: number | undefined;
}
