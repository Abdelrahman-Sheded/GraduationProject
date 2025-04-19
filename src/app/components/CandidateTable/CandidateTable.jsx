import React, { useState } from "react";
import styles from "./CandidateTable.module.scss";

const CandidateTable = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedCV, setSelectedCV] = useState("");

  const candidates = [
    // Sample data - replace with your actual data
    {
      id: 0,
      tabsome: "Value.Motivated_Resume.pdf",
      score: 0.66,
      email: "yinka.motivated.do@yand.com",
      phone: "01273712745",
    },
    {
      id: 1,
      tabsome: "Ahmed-Silik-DooOps-Engineer.qc.pdf",
      score: 0.65,
      email: "bandmoto@outlook.com",
      phone: "0103338465",
    },
    // Add other entries here...
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Top Candidate Rankings</h2>
        <div className={styles.controls}>
          <span>Number of candidates for display:</span>
          <select
            value={displayCount}
            onChange={(e) => setDisplayCount(Number(e.target.value))}
            className={styles.select}
          >
            <option value={3}>3</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h3>Referral Rankings</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tabsome</th>
              <th>Similarity Score</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {candidates.slice(0, displayCount).map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.tabsome}</td>
                <td>{candidate.score.toFixed(2)}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.removeSection}>
        <h3>Remove CV</h3>
        <div className={styles.removeControls}>
          <select
            value={selectedCV}
            onChange={(e) => setSelectedCV(e.target.value)}
            className={styles.select}
          >
            <option value="">Select CV to remove</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.tabsome}>
                {candidate.tabsome}
              </option>
            ))}
          </select>
          <button className={styles.removeButton}>Remove Selected CV</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateTable;
