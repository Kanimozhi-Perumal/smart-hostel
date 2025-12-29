const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { myGateLogs } = require("../controllers/gateLogController");

/* ================= STUDENT GATE LOGS ================= */
router.get("/logs/my", auth, myGateLogs);

module.exports = router;
