"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.scss";

function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/chat");
    }
  }, [router]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // Get the API URL based on environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("API URL from environment:", apiUrl); // Debug log

    if (!apiUrl) {
      setError(
        "API URL is not configured. Please check your environment variables."
      );
      setIsLoading(false);
      return;
    }

    // Ensure the API URL is not the frontend URL
    if (apiUrl.includes("graduation-project-iokg.vercel.app")) {
      setError(
        "Invalid API URL. The API URL should point to your Django backend, not the frontend."
      );
      setIsLoading(false);
      return;
    }

    try {
      // Remove trailing slash if present and add the endpoint
      const baseUrl = apiUrl.replace(/\/$/, "");
      const endpoint = `${baseUrl}/api-token-auth/`;

      console.log("Attempting login to:", endpoint); // Debug log

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      console.log("Response status:", res.status); // Debug log
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      ); // Debug log

      // Handle specific status codes
      if (res.status === 405) {
        throw new Error(
          "Method not allowed. The API endpoint might not support POST requests or might be protected."
        );
      }

      if (res.status === 404) {
        throw new Error(
          "API endpoint not found. Please check if the API URL is correct."
        );
      }

      // Check if the response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType);

        // Try to read the response as text to see what we're getting
        const responseText = await res.text();
        console.error("Response body:", responseText);

        if (contentType?.includes("text/html")) {
          throw new Error(
            "Server returned HTML instead of JSON. This might indicate a server error or incorrect endpoint."
          );
        } else {
          throw new Error("Server returned invalid response format");
        }
      }

      if (!res.ok) {
        let errorMessage = "Invalid username or password";
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
          // Try to read the response as text
          const responseText = await res.text();
          console.error("Error response body:", responseText);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error("Error parsing response JSON:", e);
        const responseText = await res.text();
        console.error("Response body:", responseText);
        throw new Error("Invalid response from server");
      }

      handleSuccessfulLogin(data);
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.message.includes("CORS") ||
        err.message.includes("NetworkError")
      ) {
        setError("Connection error. Please check your network and try again.");
      } else if (err.message.includes("Method not allowed")) {
        setError(
          "API endpoint error. Please check if the API URL is correct and supports POST requests."
        );
      } else if (err.message.includes("API endpoint not found")) {
        setError(
          "API endpoint not found. Please check if the API URL is correct."
        );
      } else if (err.message.includes("HTML instead of JSON")) {
        setError(
          "Server error. Please check if the API endpoint is correct and the server is running properly."
        );
      } else {
        setError(
          err.message ||
            "Login failed. Please check your credentials and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    if (!data.token) {
      throw new Error("No authentication token received");
    }

    localStorage.setItem("authToken", data.token);

    // Optional: Store additional user data if needed
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    router.push("/chat");
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <h1>Sign in to system</h1>
        </div>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.loginButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
