var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const toFunction = require("../../util/toFunction");
let message = false;
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const user = req.user;
  console.log(user);
  const infoUser = await toFunction(userModel.findApiKeys(user.id));
  if (infoUser[0]) {
    return next(infoUser[0]);
  }
  res.render("userInfo/userInfo", {
    user,
    packages: infoUser[1],
    message
  });
  message = false;
});
router.post("/", async (req, res, next) => {
  const user = req.user;
  const name = req.body.name;
  if (name) {
    user.name = name;
    userModel.update(user);
  }
  res.redirect("/profile");
});
// router.get('/', function(req, res, next) {
//   res.render('userInfo/userInfo', {title: "user info", user: req.user});
// });
module.exports = router;
