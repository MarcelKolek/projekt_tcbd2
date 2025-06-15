const mongoose = require("../models/index.js");
const { Schema } = mongoose;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "pending" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  timerIds: [{ type: Number }],
  userId: { type: Number, required: true, index: true }
});

module.exports = mongoose.model("Task", TaskSchema);
