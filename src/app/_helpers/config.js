const configs = {
    //## ElasticSearch connection URL
    elasticSearchConnUrl: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
    elasticIndex: "search_suggestions",
    
    //## Redis connection URL
    redisConnUrl: process.env.REDIS_URL || "redis://localhost:6379",

    //## server port and hostname
    serverHost: process.env.HOST || "localhost",
    serverPort: process.env.PORT || "3000",
}

module.exports = configs;