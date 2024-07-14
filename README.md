# RediLocal - Redis-Like Database using Hyperbee

RediLocal is a simple local database (for node.js) implementation inspired by Redis, using Hyperbee for storage. It provides basic key-value operations and supports batch operations, key listing, entry flushing, and more.

## Installation

1. Install `RediLocal` package from npm:

   ```bash
   npm install redilocal
   ```

2. Import `RediLocal` class into your Node.js application:

   ```javascript
   const RediLocal = require('redilocal');
   ```

## Usage

Initialize a new instance of `RediLocal`:

```javascript
const RediLocal = require('redilocal');
const redisLikeDB = new RediLocal();
```
If you want to use RAM for good performance. You can use like that.

```javascript
const RediLocal = require('redilocal');
const redisLikeDB = new RediLocal(true);
```



### `set(key, value)`

Sets a value for the given key.

```javascript
await redisLikeDB.set('key1', JSON.stringify({ name: 'Alice', age: 30 }));
```

### `get(key)`

Retrieves the value for the given key.

```javascript
const result = await redisLikeDB.get('key1');
console.log(result); // Output: { status: true, val: { name: 'Alice', age: 30 } }
```

### `del(key)`

Deletes the value for the given key.

```javascript
await redisLikeDB.del('key1');
```

### `batch(commands)`

Executes batch operations for setting and deleting keys.

```javascript
await redisLikeDB.batch([
  { type: 'put', key: 'batchkey1', value: JSON.stringify({ item: 'value1' }) },
  { type: 'del', key: 'batchkey2' }
]);
```

### `keys(pattern = '*')`

Retrieves all keys matching the optional pattern.

```javascript
const allKeys = await redisLikeDB.keys('key*');
console.log(allKeys); // Output: ['key1', 'key2']
```

### `flushall()`

Flushes all entries from the database.

```javascript
await redisLikeDB.flushall();
```

### `readAllEntry()`

Retrieves all entries from the database.

```javascript
const allEntries = await redisLikeDB.readAllEntry();
console.log(allEntries);
```

### `getLimitedEntry(reverse = true, limit = 10)`

Retrieves a limited number of entries from the history stream.

```javascript
const limitedEntries = await redisLikeDB.getLimitedEntry(false, 1);
console.log(limitedEntries);
```

### `searchEntry(gte, limit = 10)`

Searches for entries within a specified range (`gte` to `limit`).

```javascript
const searchResults = await redisLikeDB.searchEntry('entry', 10);
console.log(searchResults);
```

**Noted : All credit goes to the Holepunch teams.**
