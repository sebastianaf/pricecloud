import axios from 'axios';

import { processSuccess, processError } from './processAxios';

export const customAxios = axios.create({
  baseURL: `https://${process.env.NEXT_PUBLIC_API_HOST}`,
  withCredentials: true
});

customAxios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  (response) => {
    processSuccess(response);
    return response;
  },
  (error) => {
    processError(error);
    return error;
  }
);
