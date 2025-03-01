const searchModule = require('./modules/search');

module.exports = function(app){
    app.use("/search", searchModule);
}