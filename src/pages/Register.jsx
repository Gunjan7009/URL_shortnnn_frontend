import React, { useState } from "react";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";
import { LineStyle } from "@mui/icons-material";
import api from "../api";
const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmpassword: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await api.post("/auth/register", formData);
                setMessage(response.data.message); // Show success message
                setFormData({
                    name: "",
                    email: "",
                    mobile: "",
                    password: "",
                    confirmpassword: "",
                });
            } catch (error) {
                console.error("Registration error:", error);
                setMessage(error.response?.data?.message || "Registration failed.");
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        if (formData.password !== formData.confirmpassword)
            newErrors.confirmpassword = "Passwords do not match.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
            </div>
            <div className={styles.rightSection}>
                <div className={styles.buttonsWrapper}>
                    <button className={`${styles.button} ${styles.signUpButton}`}><Link to="/register">SignUp</Link></button>
                    <button className={`${styles.button} ${styles.loginButton}`}><Link to="/login">Login</Link> </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Join Us Today!</h2>

                    {message && <p className={styles.successMessage}>{message}</p>}


                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <span className={styles.errorMessage}>{errors.name}</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email id"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <span className={styles.errorMessage}>{errors.email}</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile no."
                            value={formData.mobile}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <span className={styles.errorMessage}>{errors.mobile}</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <span className={styles.errorMessage}>{errors.password}</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="confirmpassword"
                            placeholder="Confirm Password"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <span className={styles.errorMessage}>
                            {errors.confirmpassword}
                        </span>
                    </div>

                    <button type="submit" className={styles.registerButton}>
                        Register
                    </button>

                    <p className={styles.loginLink}> 
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;

