var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/accessmanage", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/accessNumber", { title: "Express", user: req.user });
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
