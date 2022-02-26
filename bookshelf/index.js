// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'jolly',
      password:'bar',
      database:'jckaufmanconstruction'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;