const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL || "sqlite::memory:");

const Timer = sequelize.define("timer", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: DataTypes.INTEGER,
  workTime: DataTypes.INTEGER,
  breakTime: DataTypes.INTEGER,
  cycles: DataTypes.INTEGER,
  description: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: "active" }
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
