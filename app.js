var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
var auth = require("./middleware/auth");

require("./middleware/session")(app);
require("./middleware/passport")(app);
require("dotenv").config();
var hbs = require("express-handlebars");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/",
    partialsDir: __dirname + "/views/partials/",
    helpers: {
      if_eq: (a, b) => {
        return a === b;
      }
    }
  })
);

// view engine setupsjdbsd
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// setting
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var user = require("./routes/user");
//routes
app.use("/", require("./routes/home"));

app.use("/profile", auth.user, user.profile);
app.use("/login", auth.guest, user.login); //đăng nhập rồi thì không cho vô login nữa kkk
app.use("/forgotPassword", user.forgotPass);
app.use("/logout", auth.user, user.logout);
app.use("/register", auth.user, user.register);
app.use("/recoverPassword", auth.user, user.changePass);

app.use("/demo", require("./routes/demo"));
app.use("/abcvoiceapi", require("./routes/api/abcvoiceAPI"));
app.use("/apidoc", require("./routes/apidocument"));
app.use("/packages", require("./routes/packages"));
app.use("/error", require("./routes/error/error"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.redirect("/error/404");
    return;
  }
  if (err.status === 403) {
    res.redirect("/error/403");
    return;
  }
  res.render("error/normalError", { message: err });
});

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("ABCVoice dang hoat dong tai dia chi: http://%s:%s", host, port);
});
module.exports = app;
