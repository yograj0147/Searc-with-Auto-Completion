const Redis = require("ioredis");
const config = require("../config");

// Create Redis Client
const redisClient = new Redis(config.redisConnUrl, {
    lazyConnect: true, // Prevents automatic connection
    maxRetriesPerRequest: null, // No auto-retries on failure
    enableReadyCheck: false, // Faster connection
    retryStrategy: (times) => Math.min(times * 50, 2000), // Retry logic
});

// Redis Event Listeners
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("ready", () => console.log("Redis client is ready"));
redisClient.on("error", (error) => console.error("Redis error:", error));
redisClient.on("close", () => console.log("Redis connection closed"));
redisClient.on("reconnecting", (delay) => console.log(`Reconnecting to Redis in ${delay}ms`));

// Function to start Redis connection explicitly
async function startRedis() {
    try {
        if (!redisClient.status || redisClient.status !== "ready") {
            await redisClient.connect();
        }
    } catch (err) {
        console.error("Redis client setup error:", {
            message: err.message,
            errorDetails: err.stack
        });
    }
}

// Exporting Redis Client & Start Function
module.exports = { redisClient, startRedis };
