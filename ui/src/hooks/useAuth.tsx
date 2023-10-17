import { useRouter } from 'next/router';

import { Login } from '../types/FormStates';
import paths from '../helper/paths';
import { customAxios } from '../helper/customAxios';
import { useAppContext } from '../contexts/AppContext';
import { SignupType } from '../types/signup.type';
import { useSnackbar } from '../contexts/SnackbarContext';
import { RecoveryType } from '../types/recovery.type';
import { PasswordResetType } from '../types/password-reset.type';

const useAuth = () => {
  const { setUserProfile, setIsAuth } = useAppContext();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const signin = async (data: Login) => {
    const response = await customAxios.post(paths.api.auth, data);
    if (response.status === 200) {
      router.push(paths.web.dashboard.root);
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

  const recovery = async (data: RecoveryType) => {
    await customAxios.post(paths.api.user.recovery, data);
    router.push(`/`);
  };

  const passwordReset = async (data: PasswordResetType) => {
    const token = router.query.token;
    await customAxios.patch(paths.api.user.passwordReset, {
      token,
      password: data.password
    });
    router.push(paths.web.login);
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
    recovery,
    passwordReset,
    signup,
    signout,
    check
  };
};

export default useAuth;
