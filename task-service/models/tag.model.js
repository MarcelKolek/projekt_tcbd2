const mongoose = require("mongoose");
const { Schema } = mongoose;

const TagSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Number, required: true },
  taskIds: [{ type: Schema.Types.ObjectId, ref: "Task" }]
});

module.exports = mongoose.model("Tag", TagSchema);
