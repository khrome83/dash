# Dash

![Dash Logo](https://i.imgur.com/eB77KAl.png)

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/dash/mod.ts)
[![GitHub issues](https://img.shields.io/github/issues/xpyxel/dash)](https://github.com/xpyxel/dash/issues)
[![GitHub forks](https://img.shields.io/github/forks/xpyxel/dash)](https://github.com/xpyxel/dash/network)
[![GitHub stars](https://img.shields.io/github/stars/xpyxel/dash)](https://github.com/xpyxel/dash/stargazers)
[![GitHub license](https://img.shields.io/github/license/xpyxel/dash)](https://github.com/xpyxel/dash/blob/master/LICENSE)

Dash is a simple, powerful, and efficient LRU cache for Deno.

## About

Dash is a efficient LRU (Least Recently Used) cache library.  
This means that when the cache hits it's size limit, it deletes the least used item.  
If you set your cache limit to 1000 items, and add 1001 items, the least used item will be removed.

## Options

option | description | default value
-------|-------------|--------------
limit | the amount of items the cache can store before the least used item is removed | 10000
serialize | whether or not to serialize data that can be stored in a JSON format | false
logical | whether or not to use logical mode, in which the cache raises it's limit after an item is removed a specified amount of times | false
threshold | the amount of items that need to be removed before the logical option will resize the limit | 10
increase | the amount the cache limit should be raised after the specified threshold is hit | 10

## Usage

```ts
import { Cache } from "https://deno.land/x/dash/mod.ts";

const cache = new Cache({
  limit: 50000,
  serialize: false,
});

cache.set("hello world", "some value");
const v = cache.get("hello world");
console.log(v); // "some value"
```
