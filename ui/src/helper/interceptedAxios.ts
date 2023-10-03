import axios from 'axios';
import { API_HOST } from './environment';

import { interceptError, interceptSuccess } from './interceptAxios';

export const interceptedAxios = axios.create({
  baseURL: `https://${process.env.NEXT_PUBLIC_API_HOST}`
});

interceptedAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interceptedAxios.interceptors.response.use(
  (response) => {
    interceptSuccess(response);
    return response;
  },
  (error) => {
    interceptError(error);
    return error;
  }
);
