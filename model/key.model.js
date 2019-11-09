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
  update: (idField, entity) => {
    return db.update('api_key', idField, entity);
  },
  getKeyById: id => {
    return db.load(`select * from api_key INNER JOIN KeyPackages  on api_key.id_package=KeyPackages.id and user_id=${id}`)
  },
  createEntity: () => ({
    user: "",
    key: ""
  })
};
