let db = require("../util/db");
var genKey = require("../function/genarateKey");

module.exports = {
  add: entity => {
    return db.add("api_key", entity);
  },
  searchKey: id => {
    return db.load(`select * from api_key where value='${id}'`);
  },
  singleById: id => {
    return db.load(`select * from api_key where value='${id}'`);
  },
  update: (idField, entity) => {
    return db.update("api_key", idField, entity);
  },
  getKeyById: id => {
    return db.load(
      `select * from api_key INNER JOIN KeyPackages  on api_key.id_package=KeyPackages.id and user_id=${id}`
    );
  },
  createEntity: (packages, userId, OTP) => {
    const entity = {};
    const today = new Date();
    entity.value = genKey();
    entity.id_package = packages.id;
    entity.user_id = userId;
    entity.date_start = today;
    entity.valid = false;
    entity.price = packages.price;
    const date_expired = new Date();
    entity.date_expired = new Date(
      date_expired.setDate(today.getDate() + packages.term)
    );
    entity.name_package = packages.name;
    entity.transactionId = OTP;
    console.log("entity---", entity);
    return entity;
  },
  createFreeKey: userId => {
    const entity = {};
    const today = (entity.value = genKey());
    entity.id_package = 0;
    entity.user_id = userId;
    entity.date_start = new Date();
    entity.valid = true;
    entity.price = 0;
    entity.date_expired = new Date();
    entity.name_package = null;
    entity.transactionId = null;
    return entity;
  }
};