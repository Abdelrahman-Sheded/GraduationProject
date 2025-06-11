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

    if (!process.env.NEXT_PUBLIC_DJANGO_API_URL) {
      setError(
        "API URL is not configured. Please check your environment variables."
      );
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL.endsWith("/")
        ? process.env.NEXT_PUBLIC_DJANGO_API_URL + "api-token-auth/"
        : process.env.NEXT_PUBLIC_DJANGO_API_URL + "/api-token-auth/";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
        mode: "cors",
      });

      if (!res.ok) {
        if (res.status === 308) {
          // Handle redirect
          const redirectUrl = res.headers.get("Location");
          if (redirectUrl) {
            const redirectRes = await fetch(redirectUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Origin: window.location.origin,
              },
              body: JSON.stringify({ username, password }),
              credentials: "include",
              mode: "cors",
            });

            if (!redirectRes.ok) {
              const errorData = await redirectRes.json();
              throw new Error(
                errorData.detail || "Invalid username or password"
              );
            }

            const data = await redirectRes.json();
            handleSuccessfulLogin(data);
            return;
          }
        }

        const errorData = await res.json();
        throw new Error(errorData.detail || "Invalid username or password");
      }

      const data = await res.json();
      handleSuccessfulLogin(data);
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.message.includes("CORS") ||
        err.message.includes("NetworkError")
      ) {
        setError("Connection error. Please check your network and try again.");
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
