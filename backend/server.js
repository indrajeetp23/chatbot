const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const getBotReply = async (userText) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userText }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
  
      return response.data.choices[0].message.content;
    } catch (err) {
      console.error("❌ GPT Error:", err.message);
      return `Hi! 👋 This is a test reply at ${new Date().toLocaleTimeString()}`;

    }
  };
  
  

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", async (text) => {
    const reply = await getBotReply(text);
    socket.emit("message", {
      text: reply,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
