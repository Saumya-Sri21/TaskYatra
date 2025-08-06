import axios from 'axios'
import {BASE_URL} from './apiPath'

const axiosInstance = axios.create({
  baseURL: BASE_URL, 
  timeout:10000,
  headers: {
    'Content-Type': 'application/json',
    Accept:'application/json'
  }
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
