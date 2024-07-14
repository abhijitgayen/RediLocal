const Hyperbee = require('hyperbee')
const Hypercore = require('hypercore')
const RAM = require('random-access-memory')
const debug = require('debug')('redis-like-db');

class RediLocal {
    constructor() {
        this.core = new Hypercore(RAM)
        this.db = new Hyperbee(this.core, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
    }

    async set(key, value) {
        try {
            await this.db.put(key, value);
            return true
        } catch (error) {
            debug('Error setting value:', error);
            return false
        }
    }
    async get(key) {
        try {
            const data = await this.db.get(key);
            if (data?.value) {
                return  JSON.parse(data?.value.toString('utf-8')) 
            }

            return data
        } catch (error) {
            debug('Error getting value:', error);
            return null
        }
    }

    async del(key) {
        try {
            await this.db.del(key);
            return true
        } catch (error) {
            debug('Error deleting value:', error);
            return false
        }
    }

    async batch(commands) {
        const batch = this.db.batch();
        try {
            for (const command of commands) {
                const { type, key, value } = command;
                if (type === 'put') {
                    await batch.put(key, value);
                } else if (type === 'del') {
                    await batch.del(key);
                }
            }
            return await batch.flush();
        } catch (error) {
            debug('Error executing batch:', error);
            return false
        }
    }

    async keys(pattern = '.*') {
        const keys = [];
        try {
            const regex = new RegExp(pattern); 
            for await (const { key } of this.db.createReadStream()) {
                if (regex.test(key)) { // Use test method to match against the key
                    keys.push(key);
                }
            }
        } catch (error) {
            debug('Error reading keys:', error);
            return []
        }
        return keys;
    }

    async flushall() {
        try {
            for await (const { key } of this.db.createReadStream()) {
                await this.db.del(key);
            }

            return true
        } catch (error) {
            debug('Error flushing all keys:', error);
            return false
        }
    }

    async readAllEntry() {
        const entries = [];
        try {
            for await (const { key, value } of this.db.createReadStream()) {
                entries.push({ key, value: JSON.parse(value) });
            }
        } catch (error) {
            debug('Error reading all entries:', error);
            return []
        }
        return entries;
    }

    async getLimitedEntry(reverse = true, limit = 10) {
        try {
            const entries = [];
            for await (const { key, value } of this.db.createHistoryStream({ reverse, limit })) {
                entries.push({ key, value: JSON.parse(value) });
            }
            return entries.length > 0 ? entries[0] : null;
        } catch (error) {
            debug('Error getting last written entry:', error);
            return []
        }
    }

    async searchEntry(gte, limit = 10) {
        const entries = [];
        try {
            for await (const { key, value } of this.db.createReadStream({ gte, limit, lt: `${gte}~` })) {
                entries.push({ key, value:  JSON.parse(value) });
            }
        } catch (error) {
            debug(`Error reading range (${gte} to ${lt}):`, error);
            return []
        }
        return entries;
    }

}

module.exports = RediLocal
