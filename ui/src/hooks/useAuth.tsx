import { useRouter } from 'next/router';

import { Login } from '../types/FormStates';
import paths from '../helper/paths';
import { customAxios } from '../helper/customAxios';
import { useAppContext } from '../contexts/AppContext';
import { SignupType } from '../types/user/signup.type';
import { useSnackbar } from '../contexts/SnackbarContext';

const useAuth = () => {
  const { setUserProfile, setIsAuth } = useAppContext();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const signin = async (data: Login) => {
    const response = await customAxios.post(paths.api.auth, data);
    if (response.status === 200) {
      router.push(paths.web.dashboard);
      setUserProfile(response.data);
      showSnackbar('Bienvenido a Priceclcoud', 'success');
    }
  };

  const signup = async (data: SignupType) => {
    const response = await customAxios.post(paths.api.user.root, data);
    if (response.status === 201) {
      router.push(paths.web.login);
    }
  };

  const check = async () => {
    const response = await customAxios.get(paths.api.auth);
    if (response.status === 200) {
      setIsAuth(true);
    } else {
      router.push(paths.web.login);
    }
  };

  const signout = async () => {
    router.push('/');
    setIsAuth(false);
    await customAxios.delete(paths.api.auth);
  };

  return {
    signin,
    signup,
    signout,
    check
  };
};

export default useAuth;
