import React from "react";
import api from "../api";
import styles from "./delete.module.css";

const DeleteModal = ({ isOpen, onClose, shortId, onSave }) => {
    const handleDelete = async () => {
      try {
        await api.delete(`/url/delete/${shortId}`);
        onSave(); // Refresh URL list after deletion
        onClose();
      } catch (error) {
        console.error("Error deleting URL:", error);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalinside}>
          <button className={styles.modalClose} onClick={onClose}>×</button>
          <div className={styles.modalContent}>
            <p>Are you sure you want to remove this URL?</p>
            <div className={styles.modalActions}>
              <button className={styles.modalNo} onClick={onClose}>No</button>
              <button className={styles.modalYes} onClick={handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteModal;