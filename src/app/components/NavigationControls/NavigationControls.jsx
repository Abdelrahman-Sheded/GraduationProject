"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "react-feather";
import styles from "./NavigationControls.module.scss";

export default function NavigationControls({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Set initial state based on screen width
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={togglePanel}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`${styles.navigationPanel} ${isOpen ? styles.open : ""}`}>
        <div className={styles.panelContent}>{children}</div>
      </div>
    </>
  );
}
