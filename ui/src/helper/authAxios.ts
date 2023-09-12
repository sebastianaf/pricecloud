import axios from 'axios';
import { API_HOST } from './environment';
import { interceptAxios } from './interceptAxios';

export const authAxios = axios.create({
  baseURL: API_HOST
});

authAxios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  (response) => {
    interceptAxios(response);
    return response;
  },
  (error) => {
    interceptAxios(error);
    return error;
  }
);
