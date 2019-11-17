var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const apiKeyModel = require("../../model/key.model");
const packageModel = require("../../model/packageKey.model");
const toFunction = require("../../util/toFunction");
const moment = require("moment");
const genKey = require("../../function/genarateKey");
const limitOfPerPage = 10;
let message = false;
/* GET home page. */
router.get("/accessmanage", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/accessNumber", { title: "Express", user: req.user });
});
router.get("/revenuemanage", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/revenue", { title: "Express", user: req.user });
});

router.get("/usermanage/page=:pageNumber", async (req, res, next) => {
  //if (!req.user)
  //res.redirect("/login");
  const getSizeOfTotal = await userModel.count();
  const sizeOfTotal = getSizeOfTotal[0]["count (*)"];

  const totalOfPage = Math.ceil(sizeOfTotal / limitOfPerPage);
  const pages = [];

  for (let i = 1; i <= totalOfPage; i++) {
    if (i === req.params.pageNumber)
      pages.push({
        id: i,
        curentPage: "disabled"
      });
    else
      pages.push({
        id: i
      });
  }
  const page = (req.params.pageNumber - 1) * limitOfPerPage;
  const userList = await userModel.listInLimit(page, limitOfPerPage);

  console.log(req.user);
  res.render("statistic/user", {
    title: "Express",
    user: req.user,
    pages,
    userList,
  });
});

router.get("/userdetail/id=:id/page=:pageNumber", async (req, res, next) => {
  const idUser = req.params.id;
  const getSizeOfTotal = await apiKeyModel.countOderByUserId(idUser);
  const sizeOfTotal = getSizeOfTotal[0]["count (*)"];

  const totalOfPage = Math.ceil(sizeOfTotal / limitOfPerPage);
  const pages = [];

  for (let i = 1; i <= totalOfPage; i++) {
    if (i === req.params.pageNumber)
      pages.push({
        id: i,
        curentPage: "disabled"
      });
    else
      pages.push({
        id: i
      });
  }
  const page = (req.params.pageNumber - 1) * limitOfPerPage;

  const listKey = await toFunction(
    apiKeyModel.listInLimit(idUser, page, limitOfPerPage)
  );
  if (listKey[0]) {
    return next(listKey[0]);
  }
  listKey[1] = listKey[1].map(elem => {
    let status = "Enable"
    if(elem.valid){
      status = "Disable"
    }
    elem.date_expired = moment(elem.date_expired).format("DD/MM/YYYY");
    elem.status = status;
    return elem;
  });
  console.log("xdcfvgbhn", listKey);
  res.render("statistic/userdetail", {
    title: "Express",
    user: req.user,
    listKey: listKey[1],
    pages,
    message
  });
  message = false;
});
router.post("/userdetail/changekey", async (req, res, next) => {
  console.log("idddddd", req.body.id);
  const key = await apiKeyModel.searchKey(req.body.id);
  console.log("key-------", key);
  key[0].value = genKey();
  console.log("keyafterrr-------", key);
  await apiKeyModel.update(key[0]);
  message = "Changed user's key successfully !!!"
  res.redirect(`${req.headers.referer}`);
});
router.post("/userdetail/renewkey", async (req, res, next) => {
  console.log("reqbody--", req.body);
  let key = await apiKeyModel.singleById(req.body.idKey);
  let packageInfo = await packageModel.singleById(req.body.idPackage);
  console.log("packgasdsad", packageInfo);
  console.log("key------", key);
  key[0].date_expired = moment(key[0].date_expired)
    .add(packageInfo[0].term, "days")
    .format("YYYY-MM-DD");
  await apiKeyModel.update(key[0]);
  message = "Renewed user's key successfully !!!"
  res.redirect(`${req.headers.referer}`);
});
router.post("/userdetail/validkey", async (req, res, next) => {
  console.log("reqbody--", req.body);
  let key = await toFunction(apiKeyModel.singleById(req.body.idKey));
  if(key[0])
  {
    return(next(key[0]))
  }
  console.log("key", key[1][0]);
  key[1][0].valid = !key[1][0].valid;
  const result = await toFunction(apiKeyModel.update(key[1][0]));
  if (result[0]) {
    return next(result[0]);
  } else {
    message = "Changed valid user's key successfully !!!"
    res.redirect(`${req.headers.referer}`);
  }
});
module.exports = router;
