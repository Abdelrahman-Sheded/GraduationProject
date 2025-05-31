"use client";
import React, { useState } from "react";
import Navigation from "@/app/components/ControlOptions/Navigation";
import styles from "./ControlPanel.module.scss";

function ControlPanel() {
  return (
    <div className={styles.controlPanel}>
      <div className={styles.panelContent}>
        <div className={styles.controlPanelBox}>
          <Navigation />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
