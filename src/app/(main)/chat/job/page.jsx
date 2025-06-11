"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, UploadCloud, X } from "react-feather"; // Install react-feather
import styles from "./JobManagement.module.scss";
import Link from "next/link";
import { formatJobSlug } from "@/app/utils/formatJobSlug";

// Function to remove numbers and clean up title
const cleanTitle = (title) => {
  return title
    .replace(/[0-9]/g, "") // Remove numbers
    .replace(/^test[-_\s]*/i, "") // Remove test prefix
    .replace(/[-_\s]+/g, " ") // Replace multiple spaces/dashes/underscores with single space
    .trim(); // Remove leading/trailing spaces
};

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
    const title = file.name.replace(/\.pdf$/, "").replace(/^test[-_\s]*/i, "");
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    console.log("Current job files:", jobFiles);
    console.log("New file:", { title, newSlug });

    // Check for duplicates using slugs - check if new slug is a prefix of any existing slug
    const isDuplicate = jobFiles.some((job) => {
      const existingSlug = job.slug;
      console.log("Comparing:", {
        existingSlug,
        newSlug,
        isMatch: existingSlug.startsWith(newSlug + "-"),
        jobTitle: job.title,
        jobFilename: job.filename,
      });
      return existingSlug.startsWith(newSlug + "-");
    });

    console.log("Is duplicate?", isDuplicate);

    if (isDuplicate) {
      setMessage("❌ A job with this title already exists.");
      return;
    }

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
      fetchJobList();
      setIsUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Failed to upload file.");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const encodedFilename = encodeURIComponent(filename);
      const res = await fetch(
        `http://localhost:8000/job-requirements/${encodedFilename}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      const data = await res.json();
      setMessage(data.message);
      fetchJobList(); // Refresh the list
    } catch (err) {
      setMessage("❌ Failed to delete job file.");
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
        <div className={styles.jobGrid}>
          {jobFiles.map((job, idx) => (
            <div
              key={idx}
              className={`${styles.jobCard} ${
                job.is_current ? styles.active : ""
              }`}
            >
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(job.filename)}
                title="Delete job"
              >
                <X size={14} />
              </button>
              <div className={styles.cardHeader}>
                <CheckCircle size={20} className={styles.statusIcon} />
                <Link href={`/jobs/${job.slug}`} className={styles.jobLink}>
                  <h3 className={styles.jobTitle}>
                    {cleanTitle(job.title || job.filename.replace(/_/g, " "))}
                  </h3>
                </Link>
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
      )}
    </div>
  );
}
