"use client";
import { useState, useRef } from "react";
import styles from "./UploadCV.module.scss";

export default function UploadCV() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      return false;
    }
    if (file.size > 1000000) {
      // 1MB limit
      setMessage("File size must be less than 1MB");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Point directly to FastAPI endpoint
      const response = await fetch("http://localhost:8000/upload-cv", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will handle multipart
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Upload failed");
      }

      setMessage({ text: data.message, type: "success" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setMessage({
        text: error.message || "Failed to upload CV",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadHeader}>
        <p className={styles.uploadSubtitle}>
          Upload CVs, analyze candidates, and chat with the AI assistant.
        </p>
      </div>

      <div className={styles.uploadContent}>
        <h2 className={styles.uploadSectionTitle}>Upload New CV</h2>

        <div className={styles.uploadGuidelines}>
          <p className={styles.uploadGuidelinesTitle}>
            Requirements for successful upload:
          </p>
          <ul className={styles.uploadGuidelinesList}>
            <li className={styles.uploadGuidelinesItem}>
              <span className={styles.uploadGuidelinesIcon}>✓</span>
              PDF must contain readable text (no scanned images)
            </li>
            <li className={styles.uploadGuidelinesItem}>
              <span className={styles.uploadGuidelinesIcon}>✓</span>
              Maximum file size: 1MB
            </li>
            <li className={styles.uploadGuidelinesItem}>
              <span className={styles.uploadGuidelinesIcon}>✓</span>
              No password protection
            </li>
            <li className={styles.uploadGuidelinesItem}>
              <span className={styles.uploadGuidelinesIcon}>✓</span>
              Job application-related content only
            </li>
          </ul>
        </div>

        <form className={styles.uploadForm} onSubmit={handleSubmit}>
          <div
            className={`${styles.uploadDropzone} ${
              isDragging ? styles.uploadDropzoneActive : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className={styles.uploadFileInput}
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />
            <div className={styles.uploadDropzoneContent}>
              <svg
                className={styles.uploadDropzoneIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className={styles.uploadDropzoneText}>
                {file ? file.name : "Drag and drop PDF here or click to browse"}
              </p>
              <p className={styles.uploadDropzoneHint}>
                Supported format: PDF • Max size: 1MB
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={styles.uploadSubmitButton}
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Upload CV"}
          </button>

          {message.text && (
            <div className={`${styles.uploadMessage} ${styles[message.type]}`}>
              {message.type === "success" ? "✓ " : "⚠ "}
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
