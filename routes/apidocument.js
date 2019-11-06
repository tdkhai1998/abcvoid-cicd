var express = require("express");
var router = express.Router();
var key = require("../model/key.model")
/* GET home page. */
router.get("/", function(req, res, next) {
  console.log(req.user);
  res.render("apidocument/apipage", { title: "Express", user: req.user });
});

module.exports = router;
