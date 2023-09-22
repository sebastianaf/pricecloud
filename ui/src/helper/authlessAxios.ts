import axios from 'axios';
import { API_HOST } from './environment';

import { interceptError, interceptSuccess } from './interceptAxios';

export const authlessAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST
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
    interceptSuccess(response);
    return response;
  },
  (error) => {
    interceptError(error);
    return error;
  }
);
