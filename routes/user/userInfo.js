var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const apiKeyModel = require("../../model/key.model");
const packageModel = require("../../model/packageKey.model");
const toFunction = require("../../util/toFunction");
const genKey = require("../../function/genarateKey");
const moment = require('moment');
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
  console.log('listKey----', listKey[1]);
  res.render("userInfo/userInfo", {
    user,
    listKey: listKey[1],
  });
});
router.post("/updatekey", async (req,res,next) => {
  let key = await apiKeyModel.singleById(req.body.id);
  key[0].value = genKey();
  await apiKeyModel.update('id', key[0]);
  res.redirect("/profile");
});
router.post("/renewkey", async (req, res, next) => {
  let key = await apiKeyModel.singleById(req.body.idKey);
  let packageInfo = await packageModel.singleById(req.body.id_package);
  key[0].date_expired = moment(key[0].date_expired).add(packageInfo[0].term, 'days').format('YYYY-MM-DD');
  await apiKeyModel.update('id',key[0]);
  res.redirect("/profile");
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
