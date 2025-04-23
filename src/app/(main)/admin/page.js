"use client";
import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import Navigation from "@/app/components/Navigation/navigation";
import styles from "./page.module.scss";

function AdminPage() {
  return (
    <>
      <Navigation />
      <div className={styles.adminContainer}>
        <div>
          <h1>HRs</h1>
        </div>

        {[
          "Abdelrahman El-Shahed",
          "Abdelrahman Sheded",
          "Mohamed Hussein",
          "Ramadan Tamer",
          "Mazin",
        ].map((name) => (
          <div key={name} className={styles.hrComponent}>
            <span>{name}</span>
            <div className={styles.buttonGroup}>
              <button className={styles.btn}>
                <Edit2 className={styles.btnIcon} size={18} />
              </button>
              <button className={`${styles.btn} ${styles.btnRed}`}>
                <Trash2 className={styles.btnIcon} size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminPage;
