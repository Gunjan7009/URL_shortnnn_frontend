import React, { useState } from "react";
import api from "../api";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(""); 
        if (validateForm()) {
            try {
                // Make an API call to the login endpoint
                const response = await api.post("/auth/login", formData);

                // Assuming the backend returns a token in the response
                const { token } = response.data;

                // Save the token to localStorage
                localStorage.setItem("token", token);

                // Redirect to the dashboard or home page
                window.location.href = "/";
            } catch (error) {
                // Handle server-side validation errors or network errors
                if (error.response) {
                    // If the error is from the backend (e.g., invalid credentials)
                    setServerError(error.response.data.message || "Login failed. Please try again.");
                } else {
                    // If it's a network error or something else
                    setServerError("An unexpected error occurred. Please try again later.");
                }
            }
        }
    };


    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         console.log("Form Submitted", formData);
    //     }
    // };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.password) newErrors.password = "Password is required.";
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
                    <button className={`${styles.button} ${styles.loginButton}`}><Link to="/login">Login</Link></button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Login</h2>
                    {serverError && <p className={styles.errorMessage}>{serverError}</p>}
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
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                        />
                        <span className={styles.errorMessage}>{errors.password}</span>
                    </div>

                    <button type="submit" className={styles.loginnButton}>
                        Login
                    </button>

                    <p className={styles.loginLink}>
                        Don't have an account? <Link to="/register"> Signup</Link> 
                    </p>
                </form>
            </div>
        </div>
        
    );
};

export default Login;

