const express = require("express");
const router = express.Router();
const SearchController = require("./search.controller");
const srchCtrlr = new SearchController();

router.get('/', srchCtrlr.search);
router.post('/', srchCtrlr.addSrchSuggestions);
router.delete('/', srchCtrlr.deleteIndex);


module.exports = router;