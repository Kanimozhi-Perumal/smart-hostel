const express = require("express");
const router = express.Router();

const { getAdminSummary } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const GateLog = require("../models/GateLog");

/* ================= ADMIN ROUTES ================= */

// ✅ Admin summary
router.get("/summary", auth, getAdminSummary);

// ✅ Admin gate logs
router.get("/gate-logs", auth, async (req, res) => {
  try {
    const logs = await GateLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch gate logs" });
  }
});

module.exports = router;
