"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import styles from "./MainSection.module.scss";
import UserMessage from "@/app/components/UserMessage/userMessage";
import AssistantResponse from "@/app/components/AssistantResponse/assistantResponse";
import { useRouter } from "next/navigation";

// Use environment variables for API endpoints
const CHAT_HISTORY_API = `${process.env.NEXT_PUBLIC_API_URL}/api/messages/`;
const CHAT_API = `${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat`;

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

        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.error("API URL is not configured");
          throw new Error("API URL is not configured");
        }

        console.log("Fetching chat history from:", CHAT_HISTORY_API); // Debug log

        const res = await fetch(CHAT_HISTORY_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("authToken");
            router.push("/login");
            return;
          }
          throw new Error(
            `Failed to fetch chat history: ${res.status} ${res.statusText}`
          );
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

    if (
      !process.env.NEXT_PUBLIC_API_URL ||
      !process.env.NEXT_PUBLIC_CHAT_API_URL
    ) {
      console.error("API URLs are not configured");
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "❌ API configuration error. Please contact support.",
          timestamp: new Date().toISOString(),
        },
      ]);
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

      console.log("Saving user message to:", CHAT_HISTORY_API); // Debug log

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
        credentials: "include",
      });

      if (!saveUserMessage.ok) {
        if (saveUserMessage.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        throw new Error(
          `Failed to save message: ${saveUserMessage.status} ${saveUserMessage.statusText}`
        );
      }

      console.log("Getting LLM response from:", CHAT_API); // Debug log

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
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to get LLM response: ${res.status} ${res.statusText}`
        );
      }

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

      console.log("Saving assistant response to:", CHAT_HISTORY_API); // Debug log

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
        credentials: "include",
      });

      if (!saveAssistantMessage.ok) {
        if (saveAssistantMessage.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        throw new Error(
          `Failed to save response: ${saveAssistantMessage.status} ${saveAssistantMessage.statusText}`
        );
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
          content: `❌ Error: ${error.message}. Please try again.`,
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
