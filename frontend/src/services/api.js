import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDashboardData = async () => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
};

export const fetchDeliveries = async () => {
    const response = await axios.get(`${API_URL}/deliveries`);
    return response.data;
};

export const fetchElves = async () => {
    const response = await axios.get(`${API_URL}/elves`);
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
