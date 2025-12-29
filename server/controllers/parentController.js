const Outpass = require("../models/Outpass");

/* ================= SEND PARENT OTP ================= */
exports.sendParentOTP = async (req, res) => {
  try {
    const parentId = req.user.id;

    if (!parentId) {
      return res.status(401).json({ msg: "Parent not authenticated" });
    }

    // ⚠️ DEV ONLY OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // TODO (PROD): Save OTP in DB / Redis with expiry
    console.log("📩 Parent OTP:", otp);

    res.json({
      msg: "OTP sent successfully",
      otp // ⚠️ DEV ONLY (remove in production)
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

/* ================= VERIFY OTP & APPROVE ================= */
exports.verifyOTPAndApprove = async (req, res) => {
  try {
    const { outpassId, otp } = req.body;

    if (!outpassId || !otp) {
      return res.status(400).json({ msg: "Outpass ID and OTP required" });
    }

    // 🔍 Find outpass + student
    const outpass = await Outpass.findById(outpassId).populate("student");

    if (!outpass) {
      return res.status(404).json({ msg: "Outpass not found" });
    }

    // 🔐 Parent → Student validation
    if (
      !outpass.student.parent ||
      outpass.student.parent.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // ✅ APPROVE & GENERATE QR
    outpass.status = "APPROVED";
    outpass.parent = req.user.id;
    outpass.qrCode = `QR-${outpass._id}-${Date.now()}`;

    await outpass.save();

    // 🔔 SOCKET EVENT → student dashboard
    const io = req.app.get("io");
    io.emit("outpassApproved", {
      outpassId: outpass._id,
      status: outpass.status,
      qrCode: outpass.qrCode
    });

    res.json({
      msg: "Outpass approved & QR generated ✅",
      outpass
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ msg: "Approval failed" });
  }
};
