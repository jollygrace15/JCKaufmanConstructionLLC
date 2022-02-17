// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'glorias',
      password:'bar',
      database:'gloriasdelicaciesbusiness'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;