const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Outpass = require("../models/Outpass");
const Otp = require("../models/Otp");
const generateQR = require("../utils/generateQR");

/* ================= SEND OTP ================= */
router.post("/send-otp", protect, async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ msg: "Only parents allowed" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ userId: req.user.id });

    await Otp.create({
      userId: req.user.id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    console.log("📩 OTP GENERATED:", otp);

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ msg: "OTP generation failed" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", protect, async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ msg: "OTP required" });
    }

    const record = await Otp.findOne({
      userId: req.user.id,
      otp
    });

    if (!record) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    await Otp.deleteMany({ userId: req.user.id });

    res.json({ msg: "OTP verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ msg: "OTP verification failed" });
  }
});

/* ================= APPROVE OUTPASS (🔥 FIXED) ================= */
router.post("/approve/:id", protect, async (req, res) => {
  const outpass = await Outpass.findById(req.params.id);
  if (!outpass) {
    return res.status(404).json({ msg: "Outpass not found" });
  }

  outpass.status = "APPROVED";
  outpass.qrCode = await generateQR(outpass._id);

  await outpass.save();

  res.json(outpass);
});

module.exports = router;
