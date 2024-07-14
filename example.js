const RediLocal = require('./index'); // Adjust the path as per your project structure

(async () => {
  const redisLikeDB = new RediLocal(false);

  // Set values
  await redisLikeDB.set('key1', JSON.stringify({ name: 'Alice', age: 30 }));
  await redisLikeDB.set('key2', JSON.stringify({ name: 'Bob', age: 25 }));
  await redisLikeDB.set('key3', JSON.stringify({ name: 'Charlie', age: 35 }));

  // Get values
  console.log(await redisLikeDB.get('key1')); // Output:  { name: 'Alice', age: 30 }

  // Delete a key
  await redisLikeDB.del('key2');

  // Batch operations
  await redisLikeDB.batch([
    { type: 'put', key: 'batchkey1', value: JSON.stringify({ item: 'value1' }) },
    { type: 'put', key: 'batchkey2', value: JSON.stringify({ item: 'value2' }) },
    { type: 'del', key: 'key3' }
  ]);

  // Get all keys
  const allKeys = await redisLikeDB.keys();
  console.log('All keys:', allKeys); // Output: ['key1', 'batchkey1', 'batchkey2']

  // Flush all entries
  await redisLikeDB.flushall();
  const flushedKeys = await redisLikeDB.keys();
  console.log('Flushed keys:', flushedKeys); // Output: []

  // Read all entries
  await redisLikeDB.set('entry1', JSON.stringify({ data: 'value1' }));
  await redisLikeDB.set('entry2', JSON.stringify({ data: 'value2' }));
  const allEntries = await redisLikeDB.readAllEntry();
  console.log('All entries:', allEntries);

  // Get limited entries from history
  await redisLikeDB.set('history1', JSON.stringify({ history: 'value1' }));
  await redisLikeDB.set('history2', JSON.stringify({ history: 'value2' }));
  const limitedEntries = await redisLikeDB.getLimitedEntry(false, 1); // Last written entry
  console.log('Limited entries:', limitedEntries);

  // Search entries within a range
  const searchResults = await redisLikeDB.searchEntry('entry1', 10); // Search for keys starting with 'entry'
  console.log('Search results:', searchResults);

  await redisLikeDB.flushall()
})();
