const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const Celular = require('./celular')(sequelize, DataTypes);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Celular = Celular;

module.exports = db;
