import Router from 'next/router';

import { Login } from '../models/FormStates';
import { path } from '../helper/path';
import { authlessAxios } from '../helper/authlessAxios';

const useAuth = () => {
  const login = async (data: Login) => {
    try {
      console.log(process.env.NEXT_PUBLIC_API_HOST);
      
      const response = await authlessAxios.post(path.auth, data);
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
