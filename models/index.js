//If we require a directory or folder instead of
//nodejs will default to look for index.js
const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products' // which table is this model referring to
});

const Category = bookshelf.model('Category',{
    tableName: 'categories'
})

module.exports = { Product, Category };