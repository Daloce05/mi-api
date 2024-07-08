const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectOptions: {
    ssl: false, // Puedes configurar esto según tus necesidades
  },
  ...require('../config/config.json')['development']
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Celular = require('./celulares')(sequelize, Sequelize);    // Nuevo modelo de carros

module.exports = db;