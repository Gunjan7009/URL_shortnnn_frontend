import React from "react";
import styles from "./delete.module.css";

const DeleteAcc = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalinside}>
                <button className={styles.modalClose} onClick={onClose}>×</button>
                <div className={styles.modalContent}>
                    <p>Are you sure, you want to delete this account?</p>
                    <div className={styles.modalActions}>
                        <button className={styles.modalNo} onClick={onClose}>No</button>
                        <button className={styles.modalYes} onClick={onConfirm}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAcc;
