// backend.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const cors = require('cors');

// Allow CORS for both fetch and socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for testing)
    methods: ["GET", "POST"]
  }
});

app.use(cors());


// Simple API route that ALWAYS sends JSON
app.get("/api/data", (req, res) => {
  console.log("/api/data was hit");
  res.setHeader("Cache-Control", "no-store");
  res.json({ message: "Hello 2" });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🔌 Client connected via Socket.IO");
  socket.emit("server_message", "Welcome from Socket.IO");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  //console.log(`➡ Start ngrok with: ngrok http ${PORT}`);
});
