const mongoose = require("mongoose");
const { Schema } = mongoose;

const TagSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Number, required: true },
  timerIds: [{ type: Number }]
});

module.exports = mongoose.model("Tag", TagSchema);