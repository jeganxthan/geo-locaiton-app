// models/Emergency.js
const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  latitude: Number,
  longitude: Number,
  time: { type: Date, default: Date.now, expires: 259200 }, // 3 days
});

module.exports = mongoose.model("Emergency", emergencySchema);
