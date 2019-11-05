let db = require("../util/db");

module.exports = {
  add: entity => {
    return db.add("key", entity);
  },
  searchKey: id => {
    return db.load(`select * from api_key where value='${id}'`);
  },
  singleById: id => {
    return db.load(`select * from api_key where value='${id}'`);
  },
  update: (tableName, idField, entity) => {
    db.update(tableName, idField, entity);
  },
  createEntity: () => ({
    user: "",
    key: ""
  })
};
