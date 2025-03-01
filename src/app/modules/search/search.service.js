const elasticSrchMethods = require("../../_helpers/elasticSrchMethods");
const elasticSearch = new elasticSrchMethods();

class SearchService {

    createIndex = async (index) => {
        try {
            const body = {
                mappings: {
                    properties: {
                        suggest: {
                            type: "completion"
                        },
                        search_count: { 
                            type: "integer" 
                        }
                    }
                }
            }
            const result = await elasticSearch.createIndex(index, body);

            if(result && result?.acknowledged){
                console.log(`index '${result.index}' created successfully`)
            }else if(result && !result.success){
                return result;
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

    addSuggestions = async(index, text)=>{
        try{
            const bodyVal = {
                suggest: { input: [text] },
                search_count: 1  // Initialize with 1
            }

            return await elasticSearch.indexDocument(index, text ,bodyVal);
        }catch(err){
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    searchSuggestions = async(index, query)=>{
        try{
            const command = {
                suggest: {
                    suggestion: {  // "suggestion" must be an arbitrary name (not "suggest")
                        prefix: query, // Use "prefix" instead of "text" for prefix matching
                        completion: {
                            field: "suggest",
                            fuzzy: {
                                fuzziness: "AUTO"
                            }
                        }
                    }
                },
                sort: [
                    { search_count: { order: "desc" } }  // ✅ Sort by frequency
                ]
            }
            return  await elasticSearch.searchSuggestions(index, command);
        }catch(err){
            return {
                success: false,
                error: {
                    message: err.message,
                    errorDetails: err.stack
                }
            }
        }
    }

    deleteIndex = async(index)=>{
        try{
            const response = await elasticSearch.deleteIndex(index);
            if(response){
                return response
            }
        }catch(err){
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

module.exports = SearchService;