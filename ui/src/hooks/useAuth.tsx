import Router from 'next/router';

import { Login } from '../models/FormStates';
import { path } from '../helper/path';
import { interceptedAxios } from '../helper/interceptedAxios';
import { useAppContext } from '../contexts/AppContext';

const useAuth = () => {
  const { setUserProfile, userProfile } = useAppContext();

  const login = async (data: Login) => {
    try {
      const response = await interceptedAxios.post(path.auth, data);
      const user = await response.data;

      setUserProfile(user)
      

      
      Router.push('/dashboard');
    } catch (error) {}
  };

  const signout = () => {
    window.localStorage.clear();
    Router.push('/dashboard');
  };

  return {
    login,
    signout
  };
};

export default useAuth;
