module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("session", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    timerId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: { type: DataTypes.STRING },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    indexes: [
      { fields: ['timerId'] },
      { fields: ['userId'] }
    ]
  });
  return Session;
};
