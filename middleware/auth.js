module.exports = {
  admin: (req, res, next) => {
    if (req.user) {
      if (req.user.role === "admin") {
        next();
      } else {
        next(new Error(403));
      }
    } else res.redirect("/login");
  },

  user: (req, res, next) => {
    if (req.user) {
      if (req.user.role === "user") {
        next();
      } else {
        next(new Error(403));
      }
    } else res.redirect("/login");
  },
  guest: (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      next();
      return;
    }
    res.redirect("/");
  }
};
