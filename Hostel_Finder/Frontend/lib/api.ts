import axios from 'axios';

// Create an Axios instance
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const api = axios.create({
    baseURL: rawApiUrl.replace(/\/+$/, '') + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
