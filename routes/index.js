import { user as _user, guest } from "../middleware/auth";
import {
  profile,
  login,
  forgotPass,
  logout,
  register,
  changePass
} from "./user";
import admin from "./admin";
const router = app => {
  app.use("/", require("./home"));

  app.use("/profile", _user, profile);
  app.use("/login", guest, login); //đăng nhập rồi thì không cho vô login nữa kkk
  app.use("/forgotPassword", forgotPass);
  app.use("/logout", _user, logout);
  app.use("/register", _user, register);
  app.use("/recoverPassword", _user, changePass);

  app.use("/demo", require("./demo"));
  app.use("/abcvoiceapi", require("./api/abcvoiceAPI"));
  app.use("/apidoc", require("./document"));
  app.use("/packages", require("./packages"));
  app.use("/admin", admin);
};

export default router;
