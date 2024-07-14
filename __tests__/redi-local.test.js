const RediLocal = require('../index');

describe('RediLocal', () => {
  let redisLikeDB;

  beforeEach(() => {
    redisLikeDB = new RediLocal(true);
  });

  afterEach(async () => {
    await redisLikeDB.flushall(); // Clean up after each test
  });

  test('Set and Get', async () => {
    await redisLikeDB.set('key1', JSON.stringify({ name: 'Alice', age: 30 }));
    const result = await redisLikeDB.get('key1');
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  test('Delete', async () => {
    await redisLikeDB.set('key1', JSON.stringify({ name: 'Alice', age: 30 }));
    await redisLikeDB.del('key1');
    const result = await redisLikeDB.get('key1');
    expect(result).toBeNull();
  });

  test('Batch Operations', async () => {
    await redisLikeDB.batch([
      { type: 'put', key: 'batchkey1', value: JSON.stringify({ item: 'value1' }) },
      { type: 'put', key: 'batchkey2', value: JSON.stringify({ item: 'value2' }) },
      { type: 'del', key: 'key1' }
    ]);
    const allKeys = await redisLikeDB.keys();
    expect(allKeys).toEqual(['batchkey1', 'batchkey2']);
  });

  test('Keys', async () => {
    await redisLikeDB.set('key1', JSON.stringify({ name: 'Alice', age: 30 }));
    await redisLikeDB.set('key2', JSON.stringify({ name: 'Bob', age: 25 }));
    const allKeys = await redisLikeDB.keys('key*');
    expect(allKeys).toEqual(['key1', 'key2']);
  });

  test('Read All Entries', async () => {
    await redisLikeDB.set('entry1', JSON.stringify({ data: 'value1' }));
    await redisLikeDB.set('entry2', JSON.stringify({ data: 'value2' }));
    const allEntries = await redisLikeDB.readAllEntry();
    expect(allEntries.length).toBe(2);
  });

  test('Search Entry', async () => {
    await redisLikeDB.set('entry1', JSON.stringify({ data: 'value1' }));
    await redisLikeDB.set('entry2', JSON.stringify({ data: 'value2' }));
    const searchResults = await redisLikeDB.searchEntry('entry', 10);
    expect(searchResults.length).toBe(2);
  });

});
