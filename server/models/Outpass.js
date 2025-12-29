const mongoose = require("mongoose");

const outpassSchema = new mongoose.Schema(
  {
    // 👨‍🎓 Student who applies
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 👨‍👩‍👦 Parent who approves (optional until approval)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // 📝 Reason for outpass
    reason: {
      type: String,
      required: true
    },

    // 📅 Duration
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },

    // 🔄 Status flow
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "EXITED", "ENTERED", "COMPLETED"],
      default: "PENDING"
    },

    // 🔐 QR shown only when APPROVED / EXITED
    qrCode: {
      type: String,
      default: null
    },

    // ⚠️ Risk analysis (optional, future-proof)
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Outpass", outpassSchema);
