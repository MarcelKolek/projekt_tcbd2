const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }]
}, {
  timestamps: true
});

TaskSchema.index({ userId: 1 });
module.exports = mongoose.model("Task", TaskSchema);
