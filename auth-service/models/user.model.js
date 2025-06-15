module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    }
  }, {
    indexes: [
      { fields: ['role'] }
    ]
  });
  return User;
};
