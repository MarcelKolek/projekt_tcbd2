module.exports = (sequelize, DataTypes) => {
  const Timer = sequelize.define("timer", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    workTime: { type: DataTypes.INTEGER, allowNull: false },
    breakTime: { type: DataTypes.INTEGER, allowNull: false },
    cycles: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "active" },
    description: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  });
  return Timer;
};
