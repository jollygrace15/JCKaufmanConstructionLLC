'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  //first argument: name of the table
  //second argument: an object representing the columns

  //Create Table using Javascript instead of Mysql syntax
  return db.createTable('products',{
    "id": { "type": 'int', "primaryKey":true, "autoIncrement":true, "unsigned": true},
    "name": { "type": 'string', "length":100, "notNull":true},
    "labor": 'int',
    "description":{ "type": 'string', "length":500}
})
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};