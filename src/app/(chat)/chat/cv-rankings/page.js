"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./CVRankings.module.scss";

export const dynamic = "force-dynamic";

export default function CVRankings() {
  const [displayCount, setDisplayCount] = useState(20);
  const [selectedCV, setSelectedCV] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCVs, setTotalCVs] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();
  const initialized = useRef(false);
  const pathname = usePathname();

  // Fetch fresh candidates data
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/candidates?top_n=${displayCount}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch candidates");

      const data = await response.json();
      setCandidates(data.candidates);
      setTotalCVs(data.total_cvs);
      setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [displayCount]);

  // Initial fetch
  useEffect(() => {
    if (!initialized.current) {
      fetchCandidates();
      initialized.current = true;
    }
  }, [fetchCandidates]);

  // Refresh when displayCount changes or manual refresh triggered
  useEffect(() => {
    if (initialized.current) {
      fetchCandidates();
    }
  }, [displayCount, refreshTrigger, fetchCandidates, pathname]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Manual refresh function
  const manualRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleRemoveCV = async () => {
    if (!selectedCV) return;

    try {
      const response = await fetch(
        `http://localhost:8000/remove-cv/${selectedCV}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove CV");

      manualRefresh(); // Use manual refresh instead of direct fetch
      setSelectedCV("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Add this button to your JSX for manual refresh
  const refreshButton = (
    <button
      onClick={manualRefresh}
      className={styles.refreshButton}
      disabled={loading}
    >
      Refresh Data
    </button>
  );

  if (loading)
    return <div className={styles.loading}>Loading candidates...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Top Candidate Rankings</h1>
        <div className={styles.controls}>
          <span>Number of candidates for display:</span>
          <select
            value={displayCount}
            onChange={(e) => setDisplayCount(Number(e.target.value))}
            className={styles.select}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          {/* {refreshButton} */}
          <div className={styles.cvCount}>
            {/* Total CVs: <strong>{totalCVs}</strong> */}
            {/* {lastUpdated && (
              <span className={styles.lastUpdated}>
                Last updated: {lastUpdated}
              </span>
            )} */}
          </div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <h2>Current Rankings</h2>
        <table className={styles.rankingsTable}>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Filename</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className={styles.fadeIn}>
                <td>{candidate.id + 1}</td>
                <td>{candidate.filename}</td>
                <td>{candidate.contact?.email || "N/A"}</td>
                <td>{candidate.contact?.phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.removeSection}>
        <h2>Remove CV</h2>
        <div className={styles.removeControls}>
          <select
            value={selectedCV}
            onChange={(e) => setSelectedCV(e.target.value)}
            className={styles.select}
          >
            <option value="">Select CV to remove</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.filename}>
                {candidate.filename}
              </option>
            ))}
          </select>
          <button
            onClick={handleRemoveCV}
            className={styles.removeButton}
            disabled={!selectedCV || loading}
          >
            Remove Selected CV
          </button>
        </div>
      </div>
    </div>
  );
}
