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
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Simulate typing effect for assistant responses
  const typeMessage = (fullText, callback) => {
    setIsTyping(true);
    let i = 0;
    const chunkSize = 3; // Characters to add per frame
    const frameDuration = 16; // ~60fps (16ms per frame)

    const typeNextChunk = () => {
      if (i < fullText.length) {
        const end = Math.min(i + chunkSize, fullText.length);
        callback(fullText.substring(0, end));
        i = end;
        requestAnimationFrame(typeNextChunk);
      } else {
        setIsTyping(false);
      }
    };

    // Start typing
    requestAnimationFrame(typeNextChunk);
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || isTyping) return;

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

      // API call to chat endpoint
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: inputMessage }],
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();

      // Add empty assistant response that will be filled by typing effect
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          isTyping: true,
        },
      ]);

      // Start typing animation
      typeMessage(data.response, (typedText) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.type === "assistant") {
            lastMessage.content = typedText;
            lastMessage.isTyping = typedText.length < data.response.length;
          }
          return newMessages;
        });
      });
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
            {msg.isTyping && <span className={styles.cursor}>|</span>}
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
            disabled={isLoading || isTyping}
            style={{ minHeight: "60px" }}
          />
          <button
            onClick={handleSend}
            className={styles.sendButton}
            disabled={isLoading || isTyping}
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
