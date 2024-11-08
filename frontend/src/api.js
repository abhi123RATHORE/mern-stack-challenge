import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const initializeDatabase = () => axios.get(`${API_URL}/initialize`);
export const listTransactions = (month, search, page, perPage) => axios.get(`${API_URL}/transactions`, { params: { month, search, page, perPage } });
export const getStatistics = (month) => axios.get(`${API_URL}/statistics`, { params: { month } });
export const getBarChartData = (month) => axios.get(`${API_URL}/bar-chart`, { params: { month } });
export const getPieChartData = (month) => axios.get(`${API_URL}/pie-chart`, { params: { month } });
export const getCombinedData = (month) => axios.get(`${API_URL}/combined`, { params: { month } });
