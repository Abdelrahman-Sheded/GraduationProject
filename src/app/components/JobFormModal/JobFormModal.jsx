"use client";
import React from "react";
import styles from "./JobFormModal.module.scss";

function JobFormModal({ closeForm }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Add New Job</h2>
        </div>
        <form>
          <label>
            Job Title:
            <input type="text" name="job" />
          </label>
          <label>
            Location:
            <input type="text" name="location" />
          </label>
          <label>
            Wage/hr:
            <input type="text" name="wage" />
          </label>
          <label>
            Contract Type:
            <input type="text" name="contract" />
          </label>
          <label>
            Details:
            <textarea name="details"></textarea>
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={closeForm}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobFormModal;
