import { Cache } from "./mod.ts";

import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@v0.41.0/testing/asserts.ts";

const cache = new Cache(100000);

function insertItems(count: number) {
  for (let i = 0; i < count; i++) cache.set(i, { d: i });
}

function getItems(count: number) {
  for (let i = 0; i < count; i++) {
    const value = cache.get(i);
    assertNotEquals(value, null, "The returned cache item is null");
    assertEquals(value.d, i, "Object 'd' property is not valid");
  }
}

Deno.test("Insert 100 Items", () => insertItems(100));
Deno.test("Get 100 Items", () => getItems(100));

Deno.test("Insert 1000 Items", () => insertItems(1000));
Deno.test("Get 1000 Items", () => getItems(1000));

Deno.test("Insert 10000 Items", () => insertItems(10000));
Deno.test("Get 10000 Items", () => getItems(10000));

Deno.test("Insert 100000 Items", () => insertItems(100000));
Deno.test("Get 100000 Items", () => getItems(100000));

Deno.test("Check For LRU Item Deletion", () => {
  insertItems(100001);
  assertEquals(cache.get(0), null, "Least frequently used item not deleted");
});

Deno.test("Overflow Cache Limit ", () => insertItems(200000));
