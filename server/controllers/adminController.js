const User = require("../models/User");
const Outpass = require("../models/Outpass");

/**
 * ADMIN SUMMARY
 * GET /api/admin/summary
 */
exports.getAdminSummary = async (req, res) => {
  try {
    // USERS
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalParents = await User.countDocuments({ role: "parent" });

    // OUTPASSES
    const totalOutpasses = await Outpass.countDocuments();
    const pending = await Outpass.countDocuments({ status: "PENDING" });
    const approved = await Outpass.countDocuments({ status: "APPROVED" });
    const completed = await Outpass.countDocuments({ status: "COMPLETED" });

    // TODAY ENTRY / EXIT
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayExit = await Outpass.countDocuments({
      exitTime: { $gte: startOfDay }
    });

    const todayEntry = await Outpass.countDocuments({
      entryTime: { $gte: startOfDay }
    });

    res.json({
      totalStudents,
      totalParents,
      totalOutpasses,
      pending,
      approved,
      completed,
      todayExit,
      todayEntry
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ msg: "Failed to load admin summary" });
  }
};
