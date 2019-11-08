var express = require("express");
var router = express.Router();
var packageKeyModel = require("../model/packageKey.model");
var toFunc = require("../util/toFunction");

/* GET home page. */
router.get("/", async function(req, res, next) {
  console.log(req.user);
  const listKey = await toFunc(packageKeyModel.getAll());
  console.log("listKey", listKey[1]);
  res.render("packages/packages", {
    title: "Express",
    user: req.user,
    listKey: listKey[0] === null ? listKey[1] : "error"
  });
});

module.exports = router;
