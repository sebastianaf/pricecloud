import axios from 'axios';
import { API_HOST } from './environment';
import { interceptError, interceptSuccess } from './interceptAxios';

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
    interceptSuccess(response);
    return response;
  },
  (error) => {
    interceptError(error);
    return error;
  }
);
