const Sequelize = require("sequelize");
const config = require("../config/db.config.js");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Timer = require("./timer.model.js")(sequelize, Sequelize.DataTypes);
db.Session = require("./session.model.js")(sequelize, Sequelize.DataTypes); // ✅ Use correct model definition

module.exports = db;
