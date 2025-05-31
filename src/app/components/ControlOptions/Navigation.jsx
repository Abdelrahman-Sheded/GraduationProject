"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  MessageSquare,
  Award,
  User,
  UploadCloud,
  LogIn,
  LogOut,
} from "react-feather";
import styles from "./Navigation.module.scss";

function Navigation() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

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
    <div className={styles.navigationFrame}>
      <div className={styles.navigation}>
        <div className={styles.headerSection}>
          <h1 className={styles.heading}>
            <Link href="/" className={styles.gradientText}>
              Recruitment Suite
            </Link>
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

          {isLoggedIn ? (
            <button onClick={handleLogout} className={styles.navCard}>
              <div className={styles.cardIcon}>
                <LogOut size={18} />
              </div>
              <span className={styles.cardLabel}>Logout</span>
              <div className={styles.cardHoverEffect} />
            </button>
          ) : (
            <Link href="/login" className={styles.navCard} passHref>
              <div className={styles.cardIcon}>
                <LogIn size={18} />
              </div>
              <span className={styles.cardLabel}>Login</span>
              <div className={styles.cardHoverEffect} />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
