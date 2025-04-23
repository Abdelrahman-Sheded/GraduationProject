"use client";
import React, { useState } from "react";
import ControlOptions from "@/app/components/ControlOptions/controlOptions";
import styles from "./ControlPanel.module.scss";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

function ControlPanel() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className={styles.controlPanel}>
      <button
        className={styles.navToggle}
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        {isNavOpen ? <FiX /> : <FiMenu />}
      </button>

      <div className={styles.panelContent}>
        <nav className={`${styles.navbar} ${isNavOpen ? styles.open : ""}`}>
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
        </nav>

        <div
          className={`${styles.controlPanelBox} ${
            isNavOpen ? styles.hidden : ""
          }`}
        >
          <ControlOptions />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
