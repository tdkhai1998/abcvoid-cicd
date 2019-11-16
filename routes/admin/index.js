var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const limitOfNumPage = 10 ;
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
    const sizeOfTotal = getSizeOfTotal[0]["count (*)"]
    
  const numberOfPage = Math.ceil(sizeOfTotal / limitOfNumPage);
  console.log("sooo",numberOfPage);
  const pages = [];

  for (let i = 1; i <= numberOfPage; i++) {
    if (i == req.params.pageNumber)
      pages.push({
        id: i,
        curentPage: "disabled"
      });
    else
    pages.push({
        id: i
      });
  }

  //const customerList = await customer.list(req.params.pageNumber);


  console.log(req.user);
  res.render("statistic/user", { title: "Express", user: req.user,pages });
});

router.get("/userdetail", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/userdetail", { title: "Express", user: req.user });
});

module.exports = router;
