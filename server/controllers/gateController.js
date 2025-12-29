const Outpass = require("../models/Outpass");
const GateLog = require("../models/GateLog");

/* ======================================================
   🚪 GATE SCAN CONTROLLER (QR / MANUAL / SOCKET ENABLED)
   ====================================================== */
exports.scanGate = async (req, res) => {
  try {
    const { outpassId, action } = req.body;

    /* ---------------- BASIC VALIDATION ---------------- */
    if (!outpassId || !action) {
      return res.status(400).json({
        msg: "outpassId and action required"
      });
    }

    /* ---------------- FETCH OUTPASS ---------------- */
    const outpass = await Outpass
      .findById(outpassId)
      .populate("studentId");

    if (!outpass) {
      return res.status(404).json({
        msg: "Invalid QR / Outpass not found"
      });
    }

    let allowed = true;
    let message = "Access granted";

    /* ---------------- STATUS CHECK ---------------- */
    if (outpass.status !== "APPROVED") {
      allowed = false;
      message = "Outpass not approved";
    }

    /* ---------------- EXPIRY CHECK ---------------- */
    if (new Date(outpass.toDate) < new Date()) {
      allowed = false;
      message = "Outpass expired";
    }

    /* ---------------- EXIT RULES ---------------- */
    if (action === "EXIT" && outpass.exitTime) {
      allowed = false;
      message = "Already exited";
    }

    /* ---------------- ENTRY RULES ---------------- */
    if (action === "ENTRY" && !outpass.exitTime) {
      allowed = false;
      message = "Exit not recorded yet";
    }

    if (action === "ENTRY" && outpass.entryTime) {
      allowed = false;
      message = "Already entered";
    }

    /* ---------------- SAVE GATE LOG (ALWAYS) ---------------- */
    await GateLog.create({
      outpassId,
      studentId: outpass.studentId._id,
      studentName: outpass.studentId.name,
      registerNo: outpass.studentId.registerNo || "N/A",
      action,
      allowed,
      reason: outpass.reason,
      message
    });

    /* ---------------- 🔔 SOCKET EMIT ---------------- */
    global.io.emit("gateScan", {
      allowed,
      type: action,
      studentName: outpass.studentId.name,
      registerNo: outpass.studentId.registerNo || "N/A",
      reason: outpass.reason
    });

    /* ---------------- IF DENIED ---------------- */
    if (!allowed) {
      return res.status(403).json({ msg: message });
    }

    /* ---------------- UPDATE OUTPASS ---------------- */
    if (action === "EXIT") {
      outpass.exitTime = new Date();
    }

    if (action === "ENTRY") {
      outpass.entryTime = new Date();
      outpass.status = "COMPLETED";
    }

    await outpass.save();

    /* ---------------- SUCCESS RESPONSE ---------------- */
    return res.json({
      msg:
        action === "EXIT"
          ? "Gate EXIT recorded"
          : "Gate ENTRY recorded",
      allowed: true
    });

  } catch (err) {
    console.error("🚨 GATE SCAN ERROR 👉", err);
    return res.status(500).json({
      msg: "Server error"
    });
  }
};
