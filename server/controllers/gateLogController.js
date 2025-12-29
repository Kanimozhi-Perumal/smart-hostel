const GateLog = require("../models/GateLog");

exports.myGateLogs = async (req, res) => {
  try {
    const logs = await GateLog.find({
      student: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // IMPORTANT: always return array
    res.json(logs || []);
  } catch (err) {
    console.error("Gate log fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch gate logs" });
  }
};
