var express = require("express");
var router = express.Router();
const accessControlModel = require("../../model/accessControl.model");
const apiKeyModel = require("../../model/key.model");
const keyModel = require("../../model/packageKey.model");
const moment = require("moment");
const userModel = require("../../model/user.model");
const packageModel = require("../../model/packageKey.model");
const toFunction = require("../../util/toFunction");
const genKey = require("../../function/genarateKey");
const limitOfPerPage = 10;
let message = false;
/* GET home page. */
router.get("/accessmanage", async (req, res, next) => {
  console.log(req.user);
  const year = req.query.year || moment().year();
  console.log("year-----", year);
  const access = await accessControlModel.singleByYearAndMonth(year);
  const defauleObj = {
    id: 0,
    value: 0
  };
  // let dataAccess = Array(12).fill(Object.assign({}, {id: 0, value: 0}));
  let dataAccess = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  console.log("dataaccess----", dataAccess);
  console.log("access---", access);
  access.forEach((element, index) => {
    console.log("elem----", element);
    console.log("dinexxx--", index);
    dataAccess[index].id = index + 1;
    dataAccess[index].value = element.access;
    console.log(dataAccess[index]);
  });
  console.log("dataaceessAfter----", dataAccess);
  res.render("statistic/accessNumber", {
    title: "Express",
    user: req.user,
    dataAccess,
    ByYearValue: year
  });
});
router.get("/revenuemanage", async (req, res, next) => {
  console.log(req.user);
  const year = req.query.revenueByYear || moment().year();
  console.log("year--", year);
  const total = [];
  for (i = 1; i <= 12; i++) {
    const monthFormat = ("0" + i).slice(-2);
    const thang = await apiKeyModel.getAllKeyByYear(year, monthFormat);
    if (thang[0].total === null) {
      thang[0].total = 0;
    }
    total.push({ id: i, totalSum: thang[0].total });
  }
  const allPackage = await keyModel.getAll();
  const yearBymonth = req.query.yearByMonth || moment().year();
  const monthBymonth = req.query.monthByMonth || moment().month() + 1;
  let byMonth = await apiKeyModel.getAllKeyByYearPackage(
    yearBymonth,
    monthBymonth
  );
  byMonth = byMonth.map((elem, index) => {
    elem.id = index + 100;
    elem.idName = index + 1000;
    return elem;
  });

  console.log("byMonth----", byMonth);
  console.log("allPackage----", allPackage);
  console.log("total----", total);
  const numberPackage = byMonth.length;
  res.render("statistic/revenue", {
    title: "Express",
    user: req.user,
    total,
    byMonth,
    numberPackage,
    ByYearValue: year,
    ByMonthmonthValue: monthBymonth,
    ByMonthyearValue: yearBymonth
  });
});

router.get("/usermanage", async (req, res, next) => {
  let page = req.query.page || 1;
  const getSizeOfTotal = await userModel.count();
  const sizeOfTotal = getSizeOfTotal[0]["count (*)"];

  const totalOfPage = Math.ceil(sizeOfTotal / limitOfPerPage);
  const pages = [];

  for (let i = 1; i <= totalOfPage; i++) {
    if (i === page)
      pages.push({
        id: i,
        curentPage: "disabled"
      });
    else
      pages.push({
        id: i
      });
  }
  page = (page - 1) * limitOfPerPage;
  const userList = await userModel.listInLimit(page, limitOfPerPage);
  res.render("statistic/user", {
    title: "Express",
    user: req.user,
    pages,
    userList
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
    let status = "Enable";
    if (elem.valid) {
      status = "Disable";
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
  message = "Changed user's key successfully !!!";
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
  message = "Renewed user's key successfully !!!";
  res.redirect(`${req.headers.referer}`);
});
router.post("/userdetail/validkey", async (req, res, next) => {
  console.log("reqbody--", req.body);
  let key = await toFunction(apiKeyModel.singleById(req.body.idKey));
  if (key[0]) {
    return next(key[0]);
  }
  console.log("key", key[1][0]);
  key[1][0].valid = !key[1][0].valid;
  const result = await toFunction(apiKeyModel.update(key[1][0]));
  if (result[0]) {
    return next(result[0]);
  } else {
    message = "Changed valid user's key successfully !!!";
    res.redirect(`${req.headers.referer}`);
  }
});
module.exports = router;
