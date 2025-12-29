const Outpass = require("../models/Outpass");
const analyzeRisk = require("../utils/aiRiskAnalyzer");

/**
 * CREATE OUTPASS (AI ENABLED)
 */
exports.createOutpass = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;

    // Count recent requests (last 7 days)
    const recentCount = await Outpass.countDocuments({
      studentId: req.user.id,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    // 🧠 AI risk calculation
    const riskLevel = analyzeRisk(
      { reason, fromDate, toDate },
      recentCount
    );

    const outpass = await Outpass.create({
      studentId: req.user.id,
      reason,
      fromDate,
      toDate,
      riskLevel,
      status: "PENDING"
    });

    res.status(201).json(outpass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET LOGGED-IN STUDENT OUTPASSES
 */
exports.getMyOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find({
      studentId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(outpasses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
