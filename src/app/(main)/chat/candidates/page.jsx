"use client";
import { useState, useEffect } from "react";
import styles from "./Candidates.module.scss";
import { Mail, Phone, FileText, Copy } from "react-feather";
import AnimatedSelect from "@/app/components/AnimatedSelect/AnimatedSelect";
import truncatePhone from "@/app/utils/truncatePhone";
import { motion, AnimatePresence } from "framer-motion";

export default function Candidates() {
  /* ──────────────────────────────────── state ──────────────────────────────── */
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState(""); // candidate.id
  const [details, setDetails] = useState(null); // candidate details
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  /* ─────────────────────────────────── fetch all names ────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/candidates?top_n=100");
        if (!res.ok) throw new Error("Failed to fetch candidates list");
        const data = await res.json();
        setCandidates(data.candidates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  /* ───────────────────────────────── fetch single candidate ───────────────── */
  const fetchDetails = async (id) => {
    if (id === "") return;
    setLoadingDetails(true);
    try {
      const res = await fetch(`http://localhost:8000/candidates/${id}`);
      if (!res.ok) throw new Error("Failed to fetch candidate details");
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  /* ─────────────────────────────────── remove CV ──────────────────────────── */
  const handleRemove = async () => {
    if (!details) return;
    try {
      const res = await fetch(
        `http://localhost:8000/remove-cv/${details.filename}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove CV");

      // Update UI
      setCandidates((prev) =>
        prev.filter((c) => c.filename !== details.filename)
      );
      setSelectedId("");
      setDetails(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = (text, type) => {
    if (!text || text === "N/A") return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  /* ──────────────────────────────────── render ────────────────────────────── */
  if (loadingList)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading candidates...</p>
      </div>
    );
  if (error) return <div className={styles.error}>Error: {error}</div>;
  return (
    <div className={styles.container}>
      {loadingDetails && (
        <div className={styles.topRightLoader}>
          <div className={styles.spinnerSmall}></div>
        </div>
      )}
      <div className={styles.header}>
        <h1>Candidate Details</h1>

        <AnimatedSelect
          list={candidates.map((c) => ({
            value: c.id,
            label: `#${c.id + 1} – ${c.filename}`,
          }))}
          value={selectedId}
          onChange={(v) => {
            setSelectedId(v);
            fetchDetails(v);
          }}
          placeholder="Select a candidate…"
        />
      </div>

      {/* Details card with animations */}
      <AnimatePresence>
        {details && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${styles.card} ${styles.fadeIn}`}
          >
            <div className={styles.cardHeader}>
              <FileText size={20} className={styles.iconFile} />
              <h2 className={styles.filename}>
                <a
                  href={`http://localhost:8000/pdf/${details.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {details.filename}
                </a>
              </h2>
              {/* <span className={styles.score}>
                {Math.round(details.similarity * 1000) / 1000}
              </span> */}
            </div>

            <div className={styles.contactBlock}>
              <div
                className={styles.contactRow}
                onClick={() => handleCopy(details.contact?.email, "email")}
              >
                <Mail size={20} className={styles.iconFile} />
                <span>{details.contact?.email || "N/A"}</span>
                {details.contact?.email && <Copy size={14} />}
                {copied === "email" && (
                  <span className={styles.copiedLabel}>Copied!</span>
                )}
              </div>

              <div
                className={styles.contactRow}
                onClick={() =>
                  handleCopy(truncatePhone(details.contact?.phone), "phone")
                }
              >
                <Phone size={20} className={styles.iconFile} />
                <span>{truncatePhone(details.contact?.phone) || "N/A"}</span>
                {details.contact?.phone && <Copy size={14} />}
                {copied === "phone" && (
                  <span className={styles.copiedLabel}>Copied!</span>
                )}
              </div>
            </div>

            <div className={styles.textBlock}>
              <h3>Full Text</h3>
              <pre>{details.full_text}</pre>
            </div>

            <button
              className={styles.removeButton}
              onClick={handleRemove}
              disabled={loadingDetails}
            >
              Remove This CV
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
