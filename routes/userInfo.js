var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('userInfo/userInfo', {title: "user info", user: req.user});
});

module.exports = router;
