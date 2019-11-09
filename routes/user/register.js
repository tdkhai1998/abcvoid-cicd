var express = require("express");
var router = express.Router();
var userModel = require("../../model/user.model");
var keyModel = require("../../model/key.model");
var bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const user = "edogawaconanhuyx98@gmail.com";
const password = "Cotroimoibiet12";

const createFreeKey = userId => {};
router.get("/", function(req, res, next) {
  res.render("register/register", { title: "register" });
});

router.post("/", async (req, res, next) => {
  if (req.body) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.render("register/register", {
        title: "Đăng ký",
        message: "Missing parameters"
      });
      return;
    }
    const email_user = await userModel.findByEmail(email);
    if (email_user.length > 0) {
      res.render("register/register", {
        title: "Đăng ký",
        message: "Username existed"
      });
      return;
    } else {
      const token = await sendmailActivate(req, res);
      const data = {
        email,
        password: bcrypt.hashSync(password, 10),
        role: "user",
        name: "NoName",
        token: "f",
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
  }
});
const smtpTransport = nodemailer.createTransport({
  host: "gmail.com",
  service: "Gmail",
  auth: {
    user: user,
    pass: password
  }
});
const sendmailActivate = async (req, res) => {
  const email = req.body.email;
  const token = await bcrypt.hash(email, 0);
  const link = "http://" + req.get("host") + "/verify?id=" + token;
  const mailOptions = {
    to: email,

    subject: "Kích hoạt tài khoản Sound API",
    html:
      "Chào bạn!,<br> Hãy click vào đường dẫn bên dưới để xác thực email với tài khoản Sound Api<br><a href=" +
      link +
      ">Click để xác thực</a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log("error------", process.env.NODEMAILER_PASSWORD);
      res.send(process.env.NODEMAILER_PASSWORD);
    } else {
      console.log("Message sent: " + response.message);
      // res.send("sent mail to activate account. Please check your mail box");
    }
  });
  return token;
};
module.exports = router;
