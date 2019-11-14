let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let bcrypt = require("bcrypt");
let userModel = require("../model/user.model");
let configAuth = require("../config/auth");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
let FacebookStrategy = require("passport-facebook").Strategy;
let keyModel = require("../model/key.model");

const createEntity = (profile, username) => {
  let entity = new Object();
  entity.email = username;
  entity.password = 0;
  entity.role = "user";
  entity.name = profile.displayName;
  return entity;
};
const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  (username, password, done) => {
    userModel
      .findByEmail(username)
      .then(rows => {
        if (rows.length === 0) {
          done(null, false, { message: "Invalid username." });
          return;
        }
        let user = rows[0];
        let ret = bcrypt.compareSync(password, user.password);
        if (ret) done(null, user);
        else done(null, false, { message: "Invalid password." });
      })
      .catch(err => {
        done(err, false);
      });
  }
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    let username = "gg-" + profile.id;
    userModel
      .findByEmail(username)
      .then(rows => {
        if (rows.length == 0) {
          const newUser = createEntity(profile, username);
          userModel
            .add(newUser)
            .then(info => {
              keyModel.add(keyModel.createFreeKey(info.insertId));
              done(null, newUser);
            })
            .catch(err => {
              done(err, null);
            });
        } else {
          done(null, rows[0]);
        }
      })
      .catch(err => {
        done(err, null);
      });
  }
);
const facebookStrategy = new FacebookStrategy(
  {
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    let username = "fb-" + profile.id;
    userModel
      .findByEmail(username)
      .then(rows => {
        if (rows.length == 0) {
          const newUser = createEntity(profile, username);
          userModel
            .add(newUser)
            .then(() => {
              done(null, newUser);
            })
            .catch(err => {
              done(err, null);
            });
        } else {
          done(null, rows[0]);
        }
      })
      .catch(err => {
        done(err, null);
      });
  }
);
module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(localStrategy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
  passport.serializeUser((user, done) => {
    return done(null, user);
  });
  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
