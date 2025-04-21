"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import styles from "./MainSection.module.scss";
import UserMessage from "@/app/components/UserMessage/userMessage";
import AssistantResponse from "@/app/components/AssistantResponse/assistantResponse";

function MainSection() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      // Add user message to chat
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: inputMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      setInputMessage("");
      setIsLoading(true);

      // 🕒 Start timing
      const startTime = Date.now();

      // API call to chat endpoint
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: inputMessage }],
        }),
      });

      // 🕒 End timing
      const duration = Date.now() - startTime;
      console.log(`⏱️ API response time: ${duration}ms`);

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "❌ Failed to get response. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced keyboard handling
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Dynamic textarea height
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHistory}>
        {messages.map((msg, index) => (
          <div
            key={`${msg.timestamp}-${index}`}
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
        <div ref={chatEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.chatInput}
            placeholder="Message ResumeScreener..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            style={{ minHeight: "56px" }}
          />
          <button
            onClick={handleSend}
            className={styles.sendButton}
            disabled={isLoading}
            aria-label="Send message"
          >
            <FiSend className={styles.sendIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainSection;
