"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import styles from "./MainSection.module.scss";
import UserMessage from "@/app/components/UserMessage/userMessage";
import AssistantResponse from "@/app/components/AssistantResponse/assistantResponse";
import { useRouter } from "next/navigation";

const CHAT_HISTORY_API = "http://localhost:8002/api/messages/";
const CHAT_API = "http://localhost:8000/chat";

function MainSection() {
  const router = useRouter();
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

  useEffect(() => {
    // Fetch chat history from Django when the component mounts
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(CHAT_HISTORY_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("authToken");
            router.push("/login");
            return;
          }
          throw new Error(res.statusText);
        }

        const data = await res.json();

        // Map the API data to your message format
        const formattedMessages = data.map((msg) => ({
          type: msg.sender === "user" ? "user" : "assistant",
          content: msg.message,
          timestamp: msg.timestamp,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setMessages([
          {
            type: "assistant",
            content: "Failed to load chat history. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    fetchChatHistory();
  }, [router]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || isTyping) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Add user message to chat UI
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

      // 1. Save user message to Django
      const saveUserMessage = await fetch(CHAT_HISTORY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          sender: "user",
        }),
      });

      if (!saveUserMessage.ok) {
        if (saveUserMessage.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        throw new Error("Failed to save message");
      }

      // 2. Get LLM response from FastAPI
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: inputMessage }],
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();

      // Add empty assistant response to UI (for typing effect)
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          isTyping: true,
        },
      ]);

      // 3. Save assistant response to Django
      const saveAssistantMessage = await fetch(CHAT_HISTORY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          message: data.response,
          sender: "model",
        }),
      });

      if (!saveAssistantMessage.ok) {
        if (saveAssistantMessage.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        throw new Error("Failed to save response");
      }

      // Typing animation for assistant response
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
