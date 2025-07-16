/*import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Listen for incoming messages
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", input);
      setInput("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>💬 Real-Time ChatBot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: 6,
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "75%", padding: 10 }}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
}

export default Chat;*/

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./Chat.css"; // We'll define styles in Chat.css

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    });
    return () => socket.off("message");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const userMsg = {
        text: input,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
      socket.emit("sendMessage", input);
      setInput("");
      setIsTyping(true);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🟢 GPT Friend</div>
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div className="chat-avatar">
              {msg.sender === "user" ? "🧍" : "🤖"}
            </div>
            <div className="chat-bubble">
              <div>{msg.text}</div>
              <div className="chat-timestamp">
                {msg.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message bot typing">
            <div className="chat-avatar">🤖</div>
            <div className="chat-bubble typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;


