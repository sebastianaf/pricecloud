import { ReactNode, createContext, useContext, useState } from 'react';
import { customAxios } from '../helper/customAxios';
import paths from '../helper/paths';
import { LoginType } from '../types/FormStates';
import { useRouter } from 'next/router';
import { SignupType } from '../types/signup.type';
import { RecoveryType } from '../types/recovery.type';
import { PasswordResetType } from '../types/password-reset.type';
import { useSnackbar } from './SnackbarContext';
import { UserType } from '../types/user.type';
import { LoginDataType } from '../types/login-data.type';
import { PasswordChangeType } from '../types/password-change.type';
import { HttpStatusCode } from 'axios';

type AuthContextProps = {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  signin: (data: LoginType) => Promise<boolean>;
  signup: (data: SignupType) => Promise<void>;
  recovery: (data: RecoveryType) => Promise<void>;
  passwordReset: (data: PasswordResetType) => Promise<void>;
  check: () => Promise<void>;
  signout: () => Promise<void>;
  getUser: () => Promise<void>;
  user: UserType | null;
  getLoginData: () => Promise<void>;
  loginData: LoginDataType[] | null;
  passwordChange: (data: PasswordChangeType) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loginData, setLoginData] = useState<LoginDataType[] | null>(null);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const getUser = async (): Promise<void> => {
    const response = await customAxios.get<UserType>(paths.api.user.root);
    if (response.status === HttpStatusCode.Ok) {
      response.data && setUser(response.data);
    }
  };

  const getLoginData = async (): Promise<void> => {
    const response = await customAxios.get<LoginDataType[]>(
      paths.api.auth.login
    );
    if (response.status === HttpStatusCode.Ok) {
      response.data && setLoginData(response.data);
    }
  };

  const check = async () => {
    const response = await customAxios.get(paths.api.auth.root);

    if (response.data) {
      setIsAuth(true);
    }
  };

  const signin = async (data: LoginType) => {
    const response = await customAxios.post(paths.api.auth.root, data);
    if (response.status === HttpStatusCode.Ok) {
      setIsAuth(true);
      showSnackbar('Bienvenido a Priceclcoud', 'success');
      router.push(paths.web.dashboard.root);
      return false;
    }

    if (response.status === HttpStatusCode.Gone) {
      return true;
    }

    return false;
  };

  const signup = async (data: SignupType) => {
    const response = await customAxios.post(paths.api.user.root, data);
    if (response.status === HttpStatusCode.Created) {
      router.push(paths.web.login);
    }
  };

  const recovery = async (data: RecoveryType) => {
    await customAxios.post(paths.api.auth.recovery, data);
    router.push(`/`);
  };

  const passwordReset = async (data: PasswordResetType) => {
    const token = router.query.token;
    await customAxios.patch(paths.api.auth.passwordReset, {
      token,
      password: data.password
    });
    router.push(paths.web.login);
  };

  const passwordChange = async (data: PasswordChangeType) => {
    const response = await customAxios.patch(paths.api.auth.changePassword, {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    });
    if (
      response.status === HttpStatusCode.Created ||
      response.status === HttpStatusCode.Ok
    ) {
      return true;
    }
    return false;
  };

  const signout = async () => {
    await customAxios.delete(paths.api.auth.root);
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
        signout,
        getUser,
        user,
        getLoginData,
        loginData,
        passwordChange
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
