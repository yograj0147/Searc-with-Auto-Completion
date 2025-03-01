const BaseController = require("../../_helpers/base");
const redisClient = require("../../_helpers/redisMethods");
const config = require("../../_helpers/config");
// const ElasticService = require("../../_helpers/elasticSrchMethods");
// const elasticsrch = new ElasticService();
const SearchService = require("./search.service");
const srchService = new SearchService();

class SearchController extends BaseController{
    search = async (req, res)=>{
        let resObj = {};
        try{
            const query = req.query.srchKey;
            if (!query) return this.errorResponse(res, 400, {message: "'srchKey' is required", errorDetails: {}});

            // Check Redis Cache
            let cachedResults = await redisClient.getValue(query);
            if(cachedResults) cachedResults = JSON.parse(cachedResults);

            if(cachedResults && !Array.isArray(cachedResults) && !cachedResults?.success){ return this.errorResponse(res, 500, cachedResults.error) }

            if (cachedResults) {
                return this.successResponse(res, { statusCode: 200, result: { data: cachedResults, source: "cache" } })
            }
            let suggestions = await srchService.searchSuggestions(config.elasticIndex, query);

            if(!Array.isArray(suggestions) && !suggestions?.success){ 
                return this.errorResponse(res, 500, suggestions.error) 
            }else{
                // Store in result in Redis Cache
                if(suggestions.length) await redisClient.setValue(query, JSON.stringify(suggestions));
            }

            return this.successResponse(res, { statusCode: 200, result: { data: suggestions, source: "elastic" } });

        }catch(err){
            resObj = {
                message: err.message,
                errorDetails: err.stack
            }
            return this.errorResponse(res, 500, resObj);
        }
    }
    
    addSrchSuggestions = async (req, res)=>{
        let resObj = {};
        try{
            const suggestions = req.body.suggestions;
            // Ensure index is created first
            const isIndexCreated = await srchService.createIndex(config.elasticIndex);
            if(isIndexCreated && !isIndexCreated.success){ return this.errorResponse(res, 500, isIndexCreated.error) }

            const promises = suggestions.map((suggestion) => srchService.addSuggestions(config.elasticIndex, suggestion));
            const finalResult = await Promise.all(promises);

            return this.successResponse(res, { statusCode: 200, result: { message: "Suggestions added successfully", data: finalResult } });
        }catch(err){
            resObj = {
                message: err.message,
                errorDetails: err.stack
            }
            return this.errorResponse(res, 500, resObj);
        }
    }

    deleteIndex = async (req, res) => {
        let resObj = {};
        try{
            const index = req.query.index;
            const isIndexCreated = await srchService.deleteIndex(index);

            if(isIndexCreated && isIndexCreated?.statusCode === 404){
                return this.errorResponse(res, 404, isIndexCreated.error);
            }else if(isIndexCreated){
                return this.errorResponse(res, 500, isIndexCreated.error);
            }

            return this.successResponse(res, { statusCode: 200, result: { message: "Index deleted successfully" } });

        }catch(err){
            resObj = {
                message: err.message,
                errorDetails: err.stack
            }
            return this.errorResponse(res, 500, resObj);
        }
    }
}

module.exports = SearchController;