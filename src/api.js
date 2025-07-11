import axios from "axios";



const api = axios.create({
    baseURL: "https://url-short-bacend.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

export default api;