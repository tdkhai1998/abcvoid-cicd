var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// setting
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", require("./routes/index"));
app.use("/profile", require("./routes/user/userInfo"));
app.use("/login", require("./routes/user/login"));
app.use("/forgotPassword", require("./routes/user/passwordForgot.js"));
app.use("/logout", require("./routes/user/logout"));
app.use("/register", require("./routes/user/register"));
app.use("/recoverPassword", require("./routes/user/recoverPassword"));
app.use("/verify", require("./routes/user/verifyEmail"));

app.use("/demo", require("./routes/demo"));
app.use("/abcvoiceapi", require("./routes/api/abcvoiceAPI"));
app.use("/apidoc", require("./routes/apidocument"));
app.use("/packages", require("./routes/packages"));

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
  res.render("error", { layout: false, err });
});

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("ABCVoice dang hoat dong tai dia chi: http://%s:%s", host, port);
});
module.exports = app;
