const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Outpass = require("../models/Outpass");

/* ================= APPLY OUTPASS ================= */
router.post("/", protect, async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;

    if (!reason || !fromDate || !toDate) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const outpass = await Outpass.create({
      student: req.user.id,
      parent: req.user.parent || null,
      reason,
      fromDate,
      toDate,
      status: "PENDING"
    });

    res.status(201).json(outpass);
  } catch (err) {
    console.error("APPLY OUTPASS ERROR:", err);
    res.status(500).json({ msg: "Failed to apply outpass" });
  }
});

/* ================= STUDENT OUTPASSES ================= */
router.get("/my", protect, async (req, res) => {
  const outpasses = await Outpass.find({
    student: req.user.id
  }).sort({ createdAt: -1 });

  res.json(outpasses);
});

module.exports = router;
