import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import DeleteAcc from "./DeleteAcc";
import api from "../api";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
            console.log("Fetched User Data:", response.data);
            setUser(response.data); // Extract the 'user' object correctly
          } else {
            console.warn("User data is missing from response.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
};


const handleSave = async () => {

    try {
      await api.post("/auth/updateuser", user);
    } catch (error) {
      console.error("Error in saving details", error);
      
    }
  };
  // Open Modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Confirm Delete
  const handleDelete = async () => {
    try {
        const token = localStorage.getItem('token');
        await api.delete("/auth/deleteuser", {
            headers: { Authorization: `Bearer ${token}` },  
        });
        alert('Account deleted successfully');
        localStorage.removeItem('token'); // Clear token after account deletion
        window.location.href = '/register';
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    handleCloseModal();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.profile}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <input type="text" id="name" name="name" className={styles.input} value={user.name} onChange={handleChange}  />
        </div>
        <div className={styles.profile}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input type="email" id="email" name="email" className={styles.input} value={user.email} onChange={handleChange} />
        </div>
        <div className={styles.profile}>
          <label className={styles.label} htmlFor="mobile">
            Mobile no.
          </label>
          <input type="text" id="mobile" name="mobile" className={styles.input} value={user.mobile} onChange={handleChange} />
        </div>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave}>
            Save Changes
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={handleOpenModal}
          >
            Delete Account
          </button>
        </div>
        <DeleteAcc
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
};

export default UserProfile;
