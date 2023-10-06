import Router from 'next/router';
import { useState } from 'react';

import { Login } from '../models/FormStates';
import { path } from '../helper/path';
import { customAxios } from '../helper/customAxios';
import { useAppContext } from '../contexts/AppContext';

const useAuth = () => {
  const { setUserProfile, isAuth, setIsAuth } = useAppContext();

  const login = async (data: Login) => {
    try {
      const response = await customAxios.post(path.auth, data);
      const user = response.data;

      setUserProfile(user);

      Router.push('/dashboard');
    } catch (error) {}
  };

  const check = async () => {
    const response = await customAxios.get(path.auth);
    if (response.status === 200) {
      setIsAuth(true);
    } else {
      Router.push('/login');
    }
  };

  const signout = async () => {
    await customAxios.delete(path.auth);
    Router.push('/');
  };

  return {
    login,
    signout,
    check,
    isAuth
  };
};

export default useAuth;
