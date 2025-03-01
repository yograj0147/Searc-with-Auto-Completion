const { Client } = require("@elastic/elasticsearch");
const configs = require("../config");

/* Start Elasticsearch Connection */
const esClient = new Client({ node: configs.elasticSearchConnUrl });

esClient.ping()
    .then(() => console.log("Elasticsearch connection established successfully"))
    .catch((err) => console.error("Elasticsearch connection failed:", err));

module.exports = esClient;
