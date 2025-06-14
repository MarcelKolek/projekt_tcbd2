const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, DataTypes);

db.sequelize.sync().then(async () => {
  const User = db.user;
  const [admin, created] = await User.findOrCreate({
    where: { username: "admin" },
    defaults: { password: bcrypt.hashSync("admin", 8), role: "admin", preferences: {} }
  });
  if (created) {
    console.log("Utworzono domyślnego użytkownika admin");
  }
});

module.exports = db;
