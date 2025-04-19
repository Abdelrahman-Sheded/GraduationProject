"use client";
import { useRouter } from "next/navigation"; // ✅ use Next.js router
import styles from "./page.module.scss";

function Login() {
  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();
    // perform login logic here...

    router.push("/chat"); // ✅ navigate using Next.js
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <div>
          <h1>Sign in to system</h1>
        </div>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div>
            <label className={styles.panelLabel} htmlFor="username">
              <p>Username</p>
            </label>
            <div className={styles.panelInputBox}>
              <input
                className={styles.panelInput}
                id="username"
                type="text"
                placeholder=" "
              />
              <label className={styles.inputPlaceholder} htmlFor="username">
                Enter text here...
              </label>
            </div>
          </div>

          <div>
            <label className={styles.panelLabel} htmlFor="password">
              <p>Password</p>
            </label>
            <div className={styles.panelInputBox}>
              <input
                className={styles.panelInput}
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>

          <button className={styles.btnLogin} type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
