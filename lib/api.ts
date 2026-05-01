import axios from "axios";
import { useAuthStore } from "../store/authStore";

const {token,logOut}=useAuthStore.getState();

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            logOut();
        }
        return Promise.reject(error);
    }
);

export default api;