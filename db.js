console.log('loading database')
const Sequelize = require('sequelize');// note capital on S - constructor function
// to connect const connection = new Sequelize('name of db', 'name of user', 'password', {dialect: type of database engine you are trying to connect to})
// const connection = new Sequelize('niktechnopro', 'niktechnopro', '', {host: 'localhost', dialect: 'postgres', operatorsAliases: false, logging: true})//setting up parameters for database
const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '', {
    host: process.env.DB_HOST, dialect: 
    'postgres',
    logging: false, //must be function of false
    operatorsAliases: false
})


// inside there operatorAliases: false - shuts down a 
// sequelize deprecated String based operators are now deprecated. Please use Symbol based operators for better security
// logging: false or true will shut down or turn on 

module.exports = connection;
