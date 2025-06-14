const mongoose = require("../models/index.js");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Number, required: true, index: true }
});
module.exports = mongoose.model("Category", CategorySchema);