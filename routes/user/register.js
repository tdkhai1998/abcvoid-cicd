var express = require("express");
var router = express.Router();
var userModel = require("../../model/user.model");
var keyModel = require("../../model/key.model");
var bcrypt = require("bcrypt");
router.get("/", function(req, res, next) {
  res.render("register/register", { title: "register" });
});

router.post("/", async (req, res, next) => {
  if (req.body) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("register/register", {
        title: "Đăng ký",
        message: "Missing parameters"
      });
    }
    const email_user = await userModel.findByEmail(email);
    if (email_user.length > 0) {
      return res.render("register/register", {
        title: "Đăng ký",
        message: "Missing parameters"
      });
    } else {
      const data = {
        email,
        password: bcrypt.hashSync(password, 10),
        role: "user",
        name: "NoName",
        isActivated: true
      };
      const useradd = await userModel.add(data);
      if (useradd.affectedRows === 1) {
        const freeKey = keyModel.createFreeKey(useradd.insertId);
        console.log(freeKey);
        await keyModel.add(freeKey);
        console.log("đăng ký thành công", useradd.insertId);
        return res.redirect("/login");
      } else {
        return res.render("register/register", {
          title: "Đăng ký",
          message: "Register failed"
        });
      }
    }
  } else {
    return res.render("register/register", {
      title: "Đăng ký",
      message: "Missing parameters"
    });

    // res.render("/admin/packages",
    //   message,  // thông báo
    //   listPackages,  // các packages hiện có của hệ thống
    //   user // là tên của tài khoản admin
    //  )

    //  res.render("/admin/statistics",
    //   chartYear,// [ ]: mảng doanh thu 12 tháng của năm đó
    //   chartMonthYear // [{name: <tên gói>, amount: <doanh thu gói>}]: mảng doanh thu của tất cả các gói
    //  )
  }
});

module.exports = router;
