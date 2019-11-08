var express = require("express");
var router = express.Router();
var packageKeyModel = require("../model/packageKey.model");
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
const sendOTPToMail =  (req,res, email,OTP) => {

  const link = "http://" + req.get("host") + "/packages/verify" 
  const mailOptions = {
    to: email,
    subject: "XÁC NHẬN THANH TOÁN PACKAGES API ABC VOICE",
    html:
      "Chào bạn!,<br> Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi, hãy click vào đường dẫn bên dưới để hoàn tất quá trình thanh toán package ABC VOICE<br><br>Đây là mã code của bạn: " +OTP+"<br><a href=" +
      link +
      ">Click để xác nhận </a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
}
router.get("/buy",async (req,res,next) => {
  const user = req.user
    if(!user) {
      res.redirect("/login");
    }
    const token = bcrypt.hashSync(user.email,0);
    const OTP = `G${req.query.id}-${token}`;
    sendOTPToMail(req,res,user.email,OTP);
    // add OTP vào DB
})
module.exports = router;
