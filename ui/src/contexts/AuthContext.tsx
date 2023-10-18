import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import { customAxios } from '../helper/customAxios';
import paths from '../helper/paths';
import { useAppContext } from './AppContext';
import { LoginType } from '../types/FormStates';
import { useRouter } from 'next/router';
import { SignupType } from '../types/signup.type';
import { RecoveryType } from '../types/recovery.type';
import { PasswordResetType } from '../types/password-reset.type';
import { useSnackbar } from './SnackbarContext';

type AuthContextProps = {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  signin: (data: LoginType) => Promise<void>;
  signup: (data: SignupType) => Promise<void>;
  recovery: (data: RecoveryType) => Promise<void>;
  passwordReset: (data: PasswordResetType) => Promise<void>;
  check: () => Promise<void>;
  signout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [isAuth, setIsAuth] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { setUserProfile } = useAppContext();
  const router = useRouter();

  const check = async () => {
    const response = await customAxios.get(paths.api.auth);

    if (response.data) {
      setIsAuth(true);
    }
  };

  const signin = async (data: LoginType) => {
    const response = await customAxios.post(paths.api.auth, data);
    if (response.status === 200) {
      router.push(paths.web.dashboard.root);
      setUserProfile(response.data);
      setIsAuth(true);
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

  const signout = async () => {
    await customAxios.delete(paths.api.auth);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        signin,
        setIsAuth,
        signup,
        recovery,
        passwordReset,
        check,
        signout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
