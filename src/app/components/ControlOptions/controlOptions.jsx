"use client";
import React from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Award,
  User,
  UploadCloud,
} from "react-feather";
import styles from "./ControlOptions.module.scss";

function ControlOptions() {
  const navigationItems = [
    {
      path: "/chat/cv-rankings",
      label: "Talent Leaderboard",
      icon: <Award size={18} />,
    },
    {
      path: "/chat/candidates",
      label: "Candidate Profiles",
      icon: <User size={18} />,
    },
    {
      path: "/chat",
      label: "AI Recruitment Assistant",
      icon: <MessageSquare size={18} />,
    },
    {
      path: "/chat/job",
      label: "Job Post Manager",
      icon: <FileText size={18} />,
    },
    {
      path: "/chat/upload-cv",
      label: "CV Upload Portal",
      icon: <UploadCloud size={18} />,
    },
  ];

  return (
    <div className={styles.controlOptionsFrame}>
      <div className={styles.controlOptions}>
        <div className={styles.headerSection}>
          <h1 className={styles.heading}>
            <span className={styles.gradientText}>Recruitment Suite</span>
            <span className={styles.subHeading}>Navigation Hub</span>
          </h1>
        </div>

        <nav className={styles.navigationGrid}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={styles.navCard}
              passHref
            >
              <div className={styles.cardIcon}>{item.icon}</div>
              <span className={styles.cardLabel}>{item.label}</span>
              <div className={styles.cardHoverEffect} />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default ControlOptions;
