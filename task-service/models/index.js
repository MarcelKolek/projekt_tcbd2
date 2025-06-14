const mongoose = require("mongoose");
const dbConfig = require("./../config/db.config.js");

mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Cannot connect to MongoDB:", err);
  process.exit();
});

module.exports = mongoose;