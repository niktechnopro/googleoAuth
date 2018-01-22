const Sequelize = require('sequelize');
const connection = require('../db');

//this is where we actually creating table if it was not created yet
//in sequelize language creating a model means creating a table
const Users = connection.define('test_table_two', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // to ensure every email is unique
        validate: {isEmail: true} //to ensure it looks like an email
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
        // validate:{
        //     notEmpty: true, //not allowing empty string
        // }
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    googleid: {
        type: Sequelize.STRING,
        allowNull: true
    }
})
connection.sync ({ // sync function checks for the table and creates it if does not exist
    force: true //forcefully drops the table if force set to true
}).then( () => {
});
module.exports = Users;