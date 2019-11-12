const nodemailer = require("nodemailer");
const user = "edogawaconanhuyx98@gmail.com";
const password = "Cotroimoibiet12";


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
    }
  });
  return token;
};
