var auth = require("../middleware/auth");
var user = require("./user");
var admin = require("./admin");
const router = app => {
  app.use("/", require("./home"));

  app.use("/profile", auth.user, user.profile);
  app.use("/login", auth.guest, user.login); //đăng nhập rồi thì không cho vô login nữa kkk 
  app.use("/forgotPassword", user.forgotPass);
  app.use("/logout", auth.user, user.logout);
  app.use("/register", auth.user, user.register);
  app.use("/recoverPassword", auth.user, user.changePass);

  app.use("/demo", require("./demo"));
  app.use("/abcvoiceapi", require("./api/abcvoiceAPI"));
  app.use("/apidoc", require("./document"));
  app.use("/packages", require("./packages"));
  app.use("/admin", admin);
};

module.exports = router;
