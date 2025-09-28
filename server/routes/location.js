const express = require("express");
const Emergency = require("../models/Emergency");
const auth = require("../middleware/auth");

const router = express.Router();

// Save location
router.post("/emergency", auth(["user"]), async (req, res) => {
  const { latitude, longitude } = req.body;

  const emergency = new Emergency({
    userId: req.user._id,
    latitude,
    longitude,
  });

  await emergency.save();

  req.app.get("io").emit("user-location", { latitude, longitude });
  res.json({ success: true, data: emergency });
});

// Get routes for a specific date
router.get("/by-date", auth(["admin"]), async (req, res) => {
  const { date } = req.query; // format: YYYY-MM-DD
  if (!date) return res.status(400).json({ error: "Date is required" });

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const routes = await Emergency.find({
    time: { $gte: start, $lt: end },
  }).sort({ time: 1 });

  res.json(routes);
});

module.exports = router;
