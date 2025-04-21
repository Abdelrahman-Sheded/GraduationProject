"use client";
import React from "react";
import Link from "next/link";
import styles from "./ControlOptions.module.scss";

function ControlOptions() {
  const navigationItems = [
    { path: "/chat/cv-rankings", label: "CV Rankings" },
    { path: "/chat/candidate-detail", label: "Candidate Detail" },
    { path: "/chat", label: "Chat with AI" },
    { path: "/chat/job", label: "Job Post" },
    { path: "/chat/upload-cv", label: "Upload CV" },
  ];

  return (
    <div className={styles.controlOptionsFrame}>
      <div className={styles.controlOptions}>
        <div className={styles.controlOptionRow}>
          <div>
            <h1 className={styles.heading}>Chat Navigation</h1>
          </div>
        </div>

        <div className={styles.controlOptionRow}>
          <div className={styles.chatNavigationPanel}>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={styles.navLink}
                passHref
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlOptions;
