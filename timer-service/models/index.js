const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/db.config.js");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  { host: config.HOST, dialect: config.dialect }
);

const Timer = sequelize.define("timer", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: DataTypes.INTEGER,
  workTime: DataTypes.INTEGER,
  breakTime: DataTypes.INTEGER,
  cycles: DataTypes.INTEGER,
  description: DataTypes.STRING
});
const Session = sequelize.define("session", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  timerId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
  taskId: DataTypes.INTEGER,
  status: DataTypes.STRING,
  startTime: DataTypes.DATE,
  endTime: DataTypes.DATE
});

module.exports = { sequelize, Timer, Session };
