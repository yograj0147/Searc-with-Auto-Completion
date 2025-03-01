const config = require("./config");
const SearchService = require("../modules/search/search.service");
const srchService = new SearchService();

/*--Importing data to seed--*/
const { SUGGESTIONS } = require('./seed/suggestions');

async function seedSampleData(){
    const isIndexCreated = await srchService.createIndex(config.elasticIndex);
    if(isIndexCreated && !isIndexCreated.success){ return this.errorResponse(res, 500, isIndexCreated.error) }

    const promises = SUGGESTIONS.map((suggestion) => srchService.addSuggestions(config.elasticIndex, suggestion));
    const finalResult = await Promise.all(promises);

    if(finalResult.length && finalResult[0]) console.log("Sample data for suggestion seeded successfully");
}

module.exports = { seedSampleData };