# Dash

![Dash Logo](https://owo.sh/9F8orWK.png)

Dash is a simple, powerful, and efficient LRU cache for Deno.

## About

Dash is a efficient LRU (Least Recently Used) cache library.  
This means that when the cache hits it's size limit, it deletes the least used item.  
If you set your cache limit to 1000 items, and add 1001 items, the least used item will be removed.

## Usage

```ts
const cache = new Cache({
    limit: 50000,
    serialize: false,
});
cache.set('hello world', 'some value');
const v = cache.get('hello world');
console.log(v);
```
