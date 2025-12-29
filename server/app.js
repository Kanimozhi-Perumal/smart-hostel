const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/outpass", require("./routes/outpassRoutes"));
app.use("/api/parent", require("./routes/parentRoutes"));
app.use("/api/gate", require("./routes/gateRoutes")); // ✅ REQUIRED
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Smart Hostel Backend Running 🚀");
});

/* ================= DB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

module.exports = app;
