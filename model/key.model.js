let db = require("../util/db");
var genKey = require("../function/genarateKey")

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
  update: (tableName, idField, entity) => {
    db.update(tableName, idField, entity);
  },
  createEntity: (packages, userId,OTP) => {    
    const entity={};
    const today = new Date();
    entity.value=genKey();
    entity.id_package = packages.id;
    entity.user_id = userId;
    entity.date_start = today
    entity.valid = false;
    entity.price = packages.price;
    const date_expired = new Date();
    entity.date_expired = new Date(date_expired.setDate(today.getDate() + packages.term));
    entity.name_package = packages.name;
    entity.transactionId = OTP;
    return entity;
  }
};
