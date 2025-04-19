"use client";
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import styles from "./MainSection.module.scss";
import UserMessage from "@/app/components/UserMessage/userMessage";
import AssistantResponse from "@/app/components/AssistantResponse/assistantResponse";

function MainSection() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      // Add user message to chat
      setMessages((prev) => [...prev, { type: "user", content: inputMessage }]);
      setInputMessage("");
      setIsLoading(true);

      // Simulated API call - replace with your actual endpoint
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { type: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content:
            "❌ Sorry, I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHistory}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.type === "user"
                ? styles.userMessageWrapper
                : styles.assistantWrapper
            }
          >
            {msg.type === "user" ? (
              <UserMessage message={msg.content} />
            ) : (
              <AssistantResponse response={msg.content} />
            )}
          </div>
        ))}
        {isLoading && (
          <div className={styles.assistantWrapper}>
            <div className={styles.typingIndicator}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.chatInput}
            placeholder="Message ResumeScreener..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={styles.sendButton}
            disabled={isLoading}
          >
            <FiSend className={styles.sendIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainSection;
