var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/404", function(req, res, next) {
  res.render("error/404");
});
router.get("/403", function(req, res, next) {
  res.render("error/403");
});

module.exports = router;
