const mongoose = require("mongoose");

const gateLogSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentName: String,
    registerNo: String,
    action: { type: String, enum: ["EXIT", "ENTRY"] },
    allowed: Boolean,
    reason: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("GateLog", gateLogSchema);
