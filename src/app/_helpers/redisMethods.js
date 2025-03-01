const { redisClient } = require("../_helpers/dbFiles/redisConn");

class RedisController {

    /*-------------HASH Methods-------------*/
    async setHash(hashKey, field, value) {
        try {
            await redisClient.hset(hashKey, field, value);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    async getHash(hashKey, field) {
        try {
            return await redisClient.hget(hashKey, field);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    async deleteHash(hashKey, field) {
        try {
            await redisClient.hdel(hashKey, field);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    /*-------------SETS Methods-------------*/
    async isSetMember(key, value) {
        try {
            return await redisClient.sismember(key, value);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    async addSetMember(key, value) {
        try {
            await redisClient.sadd(key, value);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    async removeSetMember(key, value) {
        try {
            await redisClient.srem(key, value);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    /*------------get value-------------------*/
    // Function to Get a Value from Redis
    async getValue(key) {
        try {
            return await redisClient.get(key);
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    // Function to Set a Value in Redis
    async setValue(key, value) {
        try {
            await redisClient.set(key, value);//setex
        } catch (err) {
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }
}

module.exports = new RedisController();