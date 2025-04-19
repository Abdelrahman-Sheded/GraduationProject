"use client";
import React from "react";
import styles from "./ControlOptions.module.scss";

function ControlOptions() {
  return (
    <div className={styles.controlOptionsFrame}>
      <div className={styles.controlOptions}>
        <div className={styles.controlOptionRow}>
          <div>
            <h1 className={styles.heading}>Control Panel</h1>
          </div>
        </div>

        <div className={styles.controlOptionRow}>
          <div>
            <label className={styles.panelLabel}>
              <p>Upload resumes</p>
            </label>
            <section className={styles.uploadResumes}>
              <div>
                <div className={styles.uploadText}>
                  <span>Drag and drop file here</span>
                </div>
                <div className={styles.uploadLimit}>
                  <small>Limit 200MB per file • CSV</small>
                </div>
              </div>
              <button className={styles.btnUpload}>Upload</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlOptions;
