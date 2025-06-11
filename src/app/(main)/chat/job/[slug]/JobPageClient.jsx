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

  // Format job title for display
  const formattedJobTitle = job.filename
    .replace(/_/g, " ")
    .replace(/\.pdf$/i, "");

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
        <h1 className={styles.jobTitle}>{formattedJobTitle}</h1>
      </div>

      <div className={styles.jobLayout}>
        <div className={styles.jobDescription}>
          <h2>Job Description</h2>
          {job.requirements ? (
            <div
              dangerouslySetInnerHTML={{
                __html: job.requirements.replace(/\n/g, "<br />"),
              }}
            />
          ) : (
            <p>No job description available.</p>
          )}
        </div>

        <div className={styles.applicationForm}>
          <h2 className={styles.formTitle}>Apply for this position</h2>

          {submitSuccess ? (
            <div className={`${styles.alert} ${styles.success}`}>
              <p>Your application has been submitted successfully!</p>
              <p>We'll review your application and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className={`${styles.alert} ${styles.error}`}>
                  <p>{error}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (123) 456-7890"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows="6"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us why you're the perfect candidate for this position..."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cv">Upload CV/Resume (PDF only) *</label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <small>Max file size: 5MB</small>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
