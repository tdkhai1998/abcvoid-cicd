let db = require("../util/db");

module.exports = {
  add: entity => {
    return db.add("key", entity);
  },
  singleById: id => {
    return db.load(`select * from api_key where id='${id}'`);
  },
  update: (tableName, idField, entity)=>{
    db.update(tableName, idField, entity);
  },
  createEntity:()=>({
    user: "",
    key:""
  })
};