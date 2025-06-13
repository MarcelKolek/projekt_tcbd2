const config = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Timer = require("./timer.model.js")(sequelize, DataTypes);
db.Session = require("./session.model.js")(sequelize, DataTypes);
db.Timer.hasMany(db.Session, { as: "sessions", foreignKey: "timerId" });
db.Session.belongsTo(db.Timer, { foreignKey: "timerId" });
module.exports = db;
