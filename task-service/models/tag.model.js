const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Number, required: true }
}, { timestamps: true });

TagSchema.index({ userId: 1 });
module.exports = mongoose.model("Tag", TagSchema);
