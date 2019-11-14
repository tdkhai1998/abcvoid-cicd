let db = require("../util/db");

module.exports = {
  add: entity => {
    return db.add("key", entity);
  },
  getAll: () => {
    return db.load(`select * from KeyPackages`);
  },
  singleById: id => {
    return db.load(`select * from KeyPackages where id='${id}'`);
  },
  findOne: id => {
    return db.load(`select * from KeyPackages where id=${id}`);
  },
  createEntity: () => ({
    user: "",
    key: ""
  })
};
