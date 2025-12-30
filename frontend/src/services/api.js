import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Global error handling with Axios interceptors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only toast for client errors (400s) and server errors (500s)
        const status = error.response?.status;
        if (status >= 400) {
            const message = error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred';
            toast.error(message, {
                id: 'global-error', // Prevent duplicate toasts for the same error
            });
        }
        return Promise.reject(error);
    }
);

export const fetchDashboardData = async () => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
};

export const fetchDeliveries = async () => {
    const response = await axios.get(`${API_URL}/deliveries`);
    return response.data;
};


// Elves API
export const fetchElves = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/elves?${params}`);
    return response.data;
};

export const fetchElfById = async (id) => {
    const response = await axios.get(`${API_URL}/elves/${id}`);
    return response.data;
};

export const updateElfStatus = async ({ id, status }) => {
    const response = await axios.patch(`${API_URL}/elves/${id}/status`, { status });
    return response.data;
};

export const reassignTasks = async ({ id, amount }) => {
    const response = await axios.patch(`${API_URL}/elves/${id}/reassign-tasks`, { amount });
    return response.data;
};

export const assignTask = async ({ id, amount }) => {
    const response = await axios.post(`${API_URL}/elves/${id}/assign-task`, { amount });
    return response.data;
};

export const autoBalanceElves = async () => {
    const response = await axios.post(`${API_URL}/elves/auto-balance`);
    return response.data;
};

export const fetchToys = async () => {
    const response = await axios.get(`${API_URL}/toys`);
    return response.data;
};

export const fetchSystemHealth = async () => {
    const response = await axios.get(`${API_URL}/system`);
    return response.data;
};

export const updateDeliveryStatus = async ({ id, status }) => {
    const response = await axios.put(`${API_URL}/deliveries/${id}`, { status });
    return response.data;
};
