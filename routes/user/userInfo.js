var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const toFunction = require("../../util/toFunction");
let message = false;
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const user = req.user;
  console.log(user);
  const listKey = await toFunction(apiKeyModel.getKeyById(user.id));
  listKey[1] = listKey[1].map(elem => {
    elem.date_expired =  moment(elem.date_expired).format('DD/MM/YYYY');
    return elem;
  });
  if (listKey[0]) {
    return next(infoUser[0]);
  }
  res.render("userInfo/userInfo", {
    user,
    listKey: listKey[1],
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
