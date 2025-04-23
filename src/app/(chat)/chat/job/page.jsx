"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, UploadCloud } from "react-feather"; // Install react-feather
import styles from "./JobManagement.module.scss";
<<<<<<< HEAD
import Link from "next/link";
import { formatJobSlug } from '@/app/utils/formatJobSlug';
=======
>>>>>>> 170c7647e9f6a7b4d2982d6b165aae4fbe2c3e66

export default function JobManagementPage() {
  const [jobFiles, setJobFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchJobList();
  }, []);

  const fetchJobList = async () => {
    try {
      const res = await fetch("http://localhost:8000/job-requirements/list");
      const data = await res.json();
      setJobFiles(data.job_files || []); // ✅ fallback to empty array
      console.log("Fetched job list:", data);
    } catch (err) {
      setMessage("⚠ Failed to load job requirements.");
      setJobFiles([]); // ✅ ensure it's not undefined
    } finally {
      setLoading(false);
    }
  };

  const setAsActive = async (path) => {
    try {
      const encodedPath = encodeURIComponent(path);
      const res = await fetch(
        `http://localhost:8000/job-requirements/set-active/${encodedPath}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      setMessage(data.message);
      fetchJobList(); // Refresh
    } catch (err) {
      setMessage("❌ Failed to update job requirements.");
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    const title = file.name.replace(/\.pdf$/, ""); // Example title from file name

    formData.append("title", title);
    formData.append("file", file);

    try {
      const res = await fetch(
        "http://localhost:8000/job-requirements/upload-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMessage(data.message || "✅ File uploaded");
      fetchJobList(); // refresh
      setIsUploading(false); // hide upload card
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Failed to upload file.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Job Requirements</h1>
        <button
          className={styles.uploadButton}
          onClick={() => setIsUploading(!isUploading)}
        >
          <UploadCloud size={18} />
          {isUploading ? "Cancel Upload" : "New Requirement"}
        </button>
      </header>

      {message && (
        <div
          className={`${styles.alert} ${
            message.includes("❌") ? styles.error : styles.success
          }`}
        >
          {message}
          <button onClick={() => setMessage("")} className={styles.closeAlert}>
            &times;
          </button>
        </div>
      )}

      {isUploading && (
        <div className={styles.uploadCard}>
          <div
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && file.type === "application/pdf") {
                console.log("Dropped file:", file);
                if (file && file.type === "application/pdf") {
                  handleUpload(file);
                }
              }
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <UploadCloud size={40} className={styles.uploadIcon} />
            <p>Drag & drop PDF file here or click to select</p>
            <input
              type="file"
              accept=".pdf"
              id="fileInput"
              className={styles.fileInput}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log("Selected file:", file);
                  if (file) {
                    handleUpload(file);
                  }
                }
              }}
            />
            <small>Max file size: 5MB</small>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.loader}></div>
          <p>Loading requirements...</p>
        </div>
      ) : (
<<<<<<< HEAD
<div className={styles.jobGrid}>
  {jobFiles.map((job, idx) => {
    const jobSlug = formatJobSlug(job.filename);
    
    return (
      <div key={idx} className={`${styles.jobCard} ${job.is_current ? styles.active : ""}`}>
        <Link href={`/chat/job/${jobSlug}`} passHref className={styles.jobLink}>
          {/* Card content remains the same */}
          <div className={styles.cardHeader}>
            <CheckCircle size={20} className={styles.statusIcon} />
            <h3>{job.filename.replace(/_/g, ' ')}</h3> {/* Display with spaces instead of underscores */}
            {job.is_current && <span className={styles.activeBadge}>Active</span>}
          </div>
          <div className={styles.cardBody}>
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>Created: {job.created}</span>
            </div>
          </div>
        </Link>

        {!job.is_current && (
          <button
            className={styles.actionButton}
            onClick={() => setAsActive(job.path)}
          >
            Set as Active
          </button>
        )}
      </div>
    );
  })}
</div>
=======
        <div className={styles.jobGrid}>
          {jobFiles.map((job, idx) => (
            <div
              key={idx}
              className={`${styles.jobCard} ${
                job.is_current ? styles.active : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <CheckCircle size={20} className={styles.statusIcon} />
                <h3>{job.filename}</h3>
                {job.is_current && (
                  <span className={styles.activeBadge}>Active</span>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.metaItem}>
                  <Clock size={16} />
                  <span>Created: {job.created}</span>
                </div>
              </div>

              {!job.is_current && (
                <button
                  className={styles.actionButton}
                  onClick={() => setAsActive(job.path)}
                >
                  Set as Active
                </button>
              )}
            </div>
          ))}
        </div>
>>>>>>> 170c7647e9f6a7b4d2982d6b165aae4fbe2c3e66
      )}
    </div>
  );
}
