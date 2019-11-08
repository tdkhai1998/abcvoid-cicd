var hat = require("hat");
var rack = hat.rack();
const genKey = () => {
  return rack();
};

module.exports = genKey;
