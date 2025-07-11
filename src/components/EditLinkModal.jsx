import React, { useState, useEffect } from "react";
import api from "../api";
import styles from "./newLinkModal.module.css";

const EditLinkModal = ({ isOpen, onClose, data, onSave }) => {
  const [url, setUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [enableExpiration, setEnableExpiration] = useState(false);

  useEffect(() => {
    if (isOpen && data) {
      setUrl(data.redirectURL);
      setRemarks(data.remarks || "");
      setExpiresAt(
        data.expiresAt
          ? new Date(data.expiresAt).toISOString().slice(0, 16)
          : ""
      );
      setEnableExpiration(!!data.expiresAt);
    }
  }, [isOpen, data]);

  const handleSave = async () => {
    try {
      const updatedData = {
        url,
        remarks,
        enableExpiration,
        expiresAt: enableExpiration
          ? expiresAt
            ? new Date(expiresAt).toISOString()
            : null
          : null,
      };
      await api.put(`/url/edit/${data.shortId}`, updatedData);
      onSave(); // Reload the data after saving
      onClose();
    } catch (error) {
      console.error("Error updating URL:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Edit Link</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <label className={styles.label}>
            Destination URL <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.inputField}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <label className={styles.label}>
            Remarks <span className={styles.required}>*</span>
          </label>
          <textarea
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

        <div className={styles.modalFooter}>
          <button className={styles.clearButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.createButton} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLinkModal;
