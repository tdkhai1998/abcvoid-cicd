var express = require("express");
var router = express.Router();
var packageKeyModel = require("../model/packageKey.model");
var keyModel = require("../model/key.model");
var toFunc = require("../util/toFunction");
var bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const user = "edogawaconanhuyx98@gmail.com";
const password = "Cotroimoibiet12";
/* GET home page. */
router.get("/", async function(req, res, next) {
  console.log(req.user);
  const listKey = await toFunc(packageKeyModel.getAll());
  console.log("listKey", listKey[1][0]);
  res.render("packages/packages", {
    title: "Express",
    user: req.user,
    listKey: listKey[0] === null ? listKey[1] : "error"
  });
});
const smtpTransport = nodemailer.createTransport({
  host: "gmail.com",
  service: "Gmail",
  auth: {
    user: user,
    pass: password
  }
});
const sendOTPToMail = (req, res, email, OTP) => {
  const link = "http://" + req.get("host") + "/packages/verify";
  const mailOptions = {
    to: email,
    subject: "XÁC NHẬN THANH TOÁN PACKAGE API ABC VOICE",
    html:
      "Chào bạn!,<br> Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi, hãy click vào đường dẫn bên dưới để hoàn tất quá trình thanh toán package ABC VOICE<br><br>Đây là mã code của bạn: " +
      OTP +
      "<br><a href=" +
      link +
      ">Click để xác nhận </a>"
  };
  console.log(mailOptions);
  return smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("Message sent: " + response.message);
      return null;
    }
  });
};
router.get("/buy/:id", async (req, res, next) => {
  const user = req.user;
  const message = "Check email đeeeeeee";
  const idPackage = req.params.id;
  if (!user) {
    res.redirect("/login");
  }
  const token = bcrypt.hashSync(user.email, 0);
  const OTP = `G${idPackage}-${token}`;
  const packages = await toFunc(packageKeyModel.findOne(idPackage));
  if (packages[0]) {
    next(packages[0]);
  } else {
    const entity = keyModel.createEntity(packages[1][0], user.id, OTP);
    const result = await toFunc(keyModel.add(entity));
    if (result[0]) {
      next(result[0]);
    } else {
      const isErr = sendOTPToMail(req, res, user.email, OTP);
      if (isErr) {
        next(isErr);
      } else {
        res.redirect("/");
      }
    }
  }
});
router.get("/verify", function(req, res, next) {
  console.log(req.user);
  const user = req.user;
  if(!user)
  {
    return res.redirect("/login");  
  }
  
  return res.render("checkcode/checkcode",{
    title:"Verify OTP",
    user
  });
  
  
});
router.post("/verify", function(req, res, next) {
  console.log(req.user);
  const user = req.user;
  if(!user)
  {
    return res.redirect("/login");  
  }
  
  return res.render("checkcode/checkcode",{
    user
  });
  
  
});
module.exports = router;
