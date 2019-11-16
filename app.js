import createError from "http-errors";
import express, { json, urlencoded, static as staticEx } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
// eslint-disable-next-line import/no-nodejs-modules
import path from "path";

const app = express();

require("./middleware/session")(app);
require("./middleware/passport")(app);
require("dotenv").config();
import hbs from "express-handlebars";
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      if_eq: (a, b) => a === b
    }
  })
);

// view engine setupsjdbsd
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// setting
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(staticEx(`${__dirname}/public`));

// sroutes

// sroutes
require("./routes").default(app);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handlerhd
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // re
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render("error/404");
    return;
  }
  if (err.status === 403) {
    res.render("error/403");
    return;
  }

  res.render("error/normalError", { message: err });
});

import debugLib from "debug";
// eslint-disable-next-line import/no-nodejs-modules
import http from "http";

const debug = debugLib("your-project-name:server");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");

      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      // process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log(`Listening on ${bind}`);
  debug("Listening on " + bind);
}
