import Router from 'next/router';

import { Login } from '../models/FormStates';
import { path } from '../helper/path';
import { authlessAxios } from '../helper/authlessAxios';
import { API_HOST } from '../helper/environment';

const useAuth = () => {
  const login = async (data: Login) => {
    try {
      const response = await authlessAxios.post(
        `${API_HOST}/${path.auth}`,
        data
      );
      const { token } = await response.data;
      window.localStorage.setItem('token', token);
      Router.push('/dashboard');
    } catch (error) {}
  };

  const signout = () => {
    window.localStorage.clear();
    Router.push('/login');
  };

  return {
    login,
    signout
  };
};

export default useAuth;
