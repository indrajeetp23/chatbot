const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", messageSchema);
