const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskName: { type: String, required: true },
    description: { type: String },
    expectedTime: { type: Number, required: true },
    actualTime: { type: Number },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
