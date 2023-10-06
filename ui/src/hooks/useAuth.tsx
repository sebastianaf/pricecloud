import { useRouter } from 'next/router';

import { Login } from '../models/FormStates';
import { path } from '../helper/path';
import { customAxios } from '../helper/customAxios';
import { useAppContext } from '../contexts/AppContext';

const useAuth = () => {
  const { setUserProfile, isAuth, setIsAuth } = useAppContext();
  const router = useRouter();

  const login = async (data: Login) => {
    const response = await customAxios.post(path.auth, data);
    if (response.status === 200) {
      setUserProfile(response.data);
      router.push('/dashboard');
    }
  };

  const check = async () => {
    const response = await customAxios.get(path.auth);
    if (response.status === 200) {
      setIsAuth(true);
    } else {
      router.push('/login');
    }
  };

  const signout = async () => {
    await customAxios.delete(path.auth);
    router.push('/');
  };

  return {
    login,
    signout,
    check,
    isAuth
  };
};

export default useAuth;
