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


// first arg is the name of the model, so the model's name is the Tag
const Tag = bookshelf.model("Tag", {
    'tableName':'tags',
    products() {
        return this.belongsToMany('Product');
    },
})
module.exports = { Product, Category, Tag };