var express = require("express");
var router = express.Router();
const accessControlModel = require('../../model/accessControl.model');
const moment = require('moment');
/* GET home page. */
router.get("/accessmanage", async (req, res, next) => {
  console.log(req.user);
  const year = moment().year();
  const month = moment().month();
  console.log('year-----', year);
  console.log('month------', month);
  const access = await accessControlModel.singleByYearAndMonth(year, month + 1);
  const defauleObj = {
    id: 0,
    value: 0
  };
  // let dataAccess = Array(12).fill(Object.assign({}, {id: 0, value: 0}));
  let dataAccess = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  console.log('dataaccess----', dataAccess);
  console.log('access---', access);
  access.forEach((element, index) => {
    console.log('elem----', element);
    console.log('dinexxx--', index);
    dataAccess[index].id = index + 1;
    dataAccess[index].value = element.access;
    console.log(dataAccess[index]);
  });
  console.log('dataaceessAfter----', dataAccess);
  res.render("statistic/accessNumber", { title: "Express", user: req.user, dataAccess });
});
router.get("/revenuemanage", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/revenue", { title: "Express", user: req.user });
});

router.get("/usermanage", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/user", { title: "Express", user: req.user });
});

router.get("/userdetail", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/userdetail", { title: "Express", user: req.user });
});

module.exports = router;
