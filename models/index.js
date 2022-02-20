//If we require a directory or folder instead of
//nodejs will default to look for index.js
const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products', // which table is this model referring to
    category() {
        return this.belongsTo('Category')
    } //The products table belongs to one category
      //A table of juices belongs to a juice category
});

const Category = bookshelf.model('Category',{ // 'Category' and the tableName: 'categories' must be related, only s is its difference.
    tableName: 'categories',
    products() {
        return this.hasMany('Product', 'category_id');
    }
})

module.exports = { Product, Category };