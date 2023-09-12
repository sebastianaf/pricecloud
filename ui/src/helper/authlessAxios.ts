import axios from 'axios';
import { API_HOST } from './environment';
import { interceptAxios } from './interceptAxios';

export const authlessAxios = axios.create({
  baseURL: API_HOST
});

authlessAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authlessAxios.interceptors.response.use(
  (response) => {
    interceptAxios(response);
    return response;
  },
  (error) => {
    interceptAxios(error);
    return error;
  }
);
