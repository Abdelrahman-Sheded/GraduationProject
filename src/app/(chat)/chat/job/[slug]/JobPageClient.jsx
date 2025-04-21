// src/app/job/[slug]/JobPageClient.js
"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./JobPage.module.scss";

export default function JobPageClient({ job }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    cv: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, cv: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("job_id", job.filename);
      formDataToSend.append("applicant_name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("cover_letter", formData.coverLetter);
      formDataToSend.append("cv_file", formData.cv);

      await axios.post(
        `http://localhost:8000/submit-application/${encodeURIComponent(
          job.filename
        )}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        cv: null,
      });
    } catch (err) {
      let errorMessage = "Failed to submit application";
      if (err.response) {
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error - please check your connection";
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.jobPage}>
      <div className={styles.jobHeader}>
        <h1 className={styles.jobTitle}>
          {job.filename.replace(/_/g, " ").replace(/\.pdf$/, "")}
        </h1>
      </div>

      <div className={styles.jobLayout}>
        <div className={styles.jobDescription}>
          <h2>Job Description</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: job.requirements.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        <div className={styles.applicationForm}>
          <h2 className={styles.formTitle}>Apply for this position</h2>

          {submitSuccess ? (
            <div className={`${styles.alert} ${styles.success}`}>
              <p>Your application has been submitted successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className={`${styles.alert} ${styles.error}`}>
                  <p>{error}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows="4"
                  value={formData.coverLetter}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cv">Upload CV (PDF only)</label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  required
                  accept=".pdf"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
