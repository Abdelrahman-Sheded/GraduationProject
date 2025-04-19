"use client";
import React from "react";
import styles from "./Navigation.module.scss";
import Link from "next/link";

function Navigation() {
  return (
    <nav className={styles.navbar}>
      <Link href="/HomePage" className={styles.navLink}>
        Home
      </Link>
      <Link href="/Posts" className={styles.navLink}>
        Job Posts
      </Link>
      <Link href="/chat" className={styles.navLink}>
        Chat
      </Link>
      <Link href="/admin" className={styles.navLink}>
        Admin
      </Link>
      {/* <Link to="/Login" className={styles.navLink}>
        Login
      </Link> */}
    </nav>
  );
}

export default Navigation;
