const esClient = require("./dbFiles/elasticSrchConn");

class ElasticSearch {

    //function to check if index exists or not
    isIndexExists = async (index) => {
        try{
            return await esClient.indices.exists({index});
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

    //function to create elasticsearch-index
    createIndex = async (index, body) => {
        try{
            const isIndexAlreadyExists = await this.isIndexExists(index);
            if(!isIndexAlreadyExists){
                return await esClient.indices.create({index, body}); 
            }
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

    deleteIndex = async (index) => {
        try{
            const isIndexAlreadyExists = await this.isIndexExists(index);
            if(isIndexAlreadyExists){
                await esClient.indices.delete({index}); 
            }else{
                return {
                    statusCode: 404,
                    success: false,
                    error: {
                        message: "Index does not exists"
                    }
                }
            }
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

    // Function to index a document or adding suggestion to the document
    indexDocument = async (index, id, bodyVal) =>{
        try {
            return await esClient.index({
                index,
                id,
                body: bodyVal
            });
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

    searchSuggestions = async (index, command) => {
        try {
            const response = await esClient.search({
                index,
                body: command
            });

            if (!response && (!response?.suggest || !response?.suggest?.suggestion)) {
                return [];
            }
  
            const suggestions = response.suggest.suggestion[0].options.map(option => option.text);
   
            // Increment search count for selected suggestion (if any)
            if (suggestions.length > 0) {
                await this.incrementSearchCount(index, suggestions[0]);
            }

            return suggestions
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

    incrementSearchCount = async (index, text) => {
        try{
            await this.esClient.update({
                index,
                id: text,  // Update by ID
                body: {
                  script: {
                    source: "ctx._source.search_count = (ctx._source.search_count ?: 0) + 1",
                    lang: "painless"
                  }
                }
            });
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
};

module.exports = ElasticSearch;
