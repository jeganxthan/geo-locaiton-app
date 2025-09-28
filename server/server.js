require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ User/Admin connected:", socket.id);

  socket.on("user-location", (data) => {
    console.log("User location:", data);
    io.emit("user-location", data); // broadcast to all admins
  });

  socket.on("emergency-alert", (data) => {
    console.log("Emergency alert:", data);
    io.emit("emergency-alert", data); // notify admins
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});



app.use("/auth", authRoutes);
app.use("/location", locationRoutes);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
