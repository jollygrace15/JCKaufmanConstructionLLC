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
  return db.addColumn('products', 'brand_id', {
    'type':'init',
    ''
  }); //for bookshelf to work the column name of the fk should be the singular version
  //of the table name, with _id at the back
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
