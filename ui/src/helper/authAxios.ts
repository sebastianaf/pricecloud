import axios from 'axios';
import { apiHost } from './environment';

export const axiosAuth = axios.create({
  baseURL: apiHost
});

axiosAuth.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error;
  }
);
