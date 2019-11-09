var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  console.log(req.user);
  res.render("checkcode/checkcode");
});

module.exports = router;
