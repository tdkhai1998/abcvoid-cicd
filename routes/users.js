var express = require("express");
var router = express.Router();
const userModel = require("../model/user.model");
const toFunction = require("../util/toFunction");
/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.get("/profile", async (req, res, next) => {
  const user = req.user;
  const infoUser = await toFunction(userModel.findApiKeys(user.id));
  if (infoUser[0]) {
    return next(infoUser[0]);
  }
  res.render("/profile", {
    user,
    packages: infoUser[1]
  });
});
router.post("/profile", async (req, res, next) => {
  const user = req.user;
  const name = req.body.name;
  if (name) {
    user.name = name;
    userModel.update(user);
  }
  res.redirect("/user/profile");
});
module.exports = router;
