const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../../config')

exports.seed = async function (knex) {
  
  await knex('roles').insert([
    { role_name: 'admin' },
    { role_name: 'organizer' },
    { role_name: 'guest' },        
  ])
  await knex('users').insert([
    {
      username: 'admin',
      password: bcrypt.hashSync('password', BCRYPT_ROUNDS), // password "password"
      role_id: 1,
    },
    {
      username: 'tom',
      password: bcrypt.hashSync('1234', BCRYPT_ROUNDS), // password "1234"
      role_id: 2,
    },
    {
      username: 'jerry',
      password: bcrypt.hashSync('1234', BCRYPT_ROUNDS), // password "1234"
      role_id: 2,
    },
    {
      username: 'odie',
      password: bcrypt.hashSync('1234', BCRYPT_ROUNDS), // password "1234"
      role_id: 3,
    },    
    {
      username: 'garfield',
      password: bcrypt.hashSync('1234', BCRYPT_ROUNDS), // password "1234"
      role_id: 3,
    }    
  ])
}