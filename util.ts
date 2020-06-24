/**
 * Check if data is JSON serializable
 * @param value The value to check
 */
function isSerializable(value: any): boolean {
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
export function serialize(data: any): Uint8Array | any {
  if (isSerializable(data)) {
    const dataString = JSON.stringify(data);
    return encoder.encode(dataString);
  } else return data;
}

export type Nullable<T> = T | null;
export type Identifier = string | number;

export interface State {
  limit: number;
  overwrites: number;
  oldLimit: number | undefined;
}
