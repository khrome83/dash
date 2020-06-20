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

/**
 * Attempts to serialize data into a JSON format
 * @param data The data to serialize
 */
export function serialize(data: any): Uint8Array {
  let serializedData = null;
  const dataString = JSON.stringify(data);
  serializedData = new Uint8Array(dataString.length);
  serializedData.set(dataString.split("").map((c) => c.charCodeAt(0)));
  return serializedData;
}

export type Nullable<T> = T | null;
export type Identifier = string | number;
