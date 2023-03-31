const Sequelize = require('sequelize');

// Create connection
const sequelize_osu = new Sequelize('database', 'user', 'password', {
    host: "localhost",
    dialect: 'sqlite',
    logging: false,
    storage: './database/osu.sqlite'
})

const sequelize_roles = new Sequelize('database', 'user', 'password', {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: './database/roles.sqlite'
})

const sequelize_birthdays = new Sequelize('database', 'user', 'password', {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: './database/birthdays.sqlite'
})

const OsuDB = require("../models/Osu")(sequelize_osu, Sequelize.DataTypes)
const RolesDB = require("../models/Roles")(sequelize_roles, Sequelize.DataTypes)
const BirthdaysDB = require("../models/Birthdays")(sequelize_birthdays, Sequelize.DataTypes)

module.exports = { OsuDB, RolesDB, BirthdaysDB };
