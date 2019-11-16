var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const limitOfPerPage = 10 ;
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
  const page = (req.params.pageNumber-1)*limitOfPerPage;
  const userList = await userModel.listInLimit(page,limitOfPerPage)

  console.log(req.user);
  res.render("statistic/user", { title: "Express", user: req.user,pages,userList });
});

router.get("/userdetail", function(req, res, next) {
  console.log(req.user);
  res.render("statistic/userdetail", { title: "Express", user: req.user });
});

module.exports = router;
