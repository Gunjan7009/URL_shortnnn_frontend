import React, { useEffect, useState } from "react";
import styles from "./newLinkModal.module.css";
import api from "../api";

const NewLinkModal = ({ isOpen, onClose, onLinkAdded }) => {
  const [url, setUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [enableExpiration, setEnableExpiration] = useState(false);


  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setUrl("");
    setRemarks("");
    setExpiresAt("");
    setEnableExpiration(false);
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!url) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      const response = await api.post("/url/shorten", {
        url,
        remarks,
        enableExpiration,
        expiresAt: enableExpiration
          ? expiresAt
            ? new Date(expiresAt).toISOString()
            : null
          : null,
      });

      alert(`Short URL Created: ${response.data.shortUrl}`);
      resetForm();
      onLinkAdded(); //
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error creating short URL:", error);
      alert("Failed to create short URL. Try again.");
    }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3>New Link</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <label className={styles.label}>
            Destination URL <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="https://example.com"
            className={styles.inputField}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <label className={styles.label}>
            Comments <span className={styles.required}>*</span>
          </label>
          <textarea
            placeholder="Add remarks"
            className={styles.textAreaField}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          ></textarea>

          <div className={styles.toggleContainer}>
            <label className={styles.label}>Link Expiration</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={enableExpiration}
                onChange={() => setEnableExpiration(!enableExpiration)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <input
            type="datetime-local"
            className={styles.inputField}
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            disabled={!enableExpiration}
          />
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.clearButton} onClick={resetForm}>
            Clear
          </button>
          <button className={styles.createButton} onClick={handleSubmit}>
            Create new
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLinkModal;
