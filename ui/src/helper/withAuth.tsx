import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from '../../pages/_app';
import { useAuth } from '../contexts/AuthContext';
import { ro } from 'date-fns/locale';
import paths from './paths';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: any) => {
  const AuthComponent: NextPageWithLayout = (props) => {
    const [isClient, setIsClient] = useState(false);
    const { check, isAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      setIsClient(true);
      if (isClient) {
        const runCheck = async () => await check();
        runCheck();
      }
      if (!isAuth) {
        router.push(paths.web.login);
      }
    }, [isClient, isAuth]);

    if (!isClient || !isAuth) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  if (WrappedComponent.getLayout) {
    AuthComponent.getLayout = WrappedComponent.getLayout;
  }

  return AuthComponent;
};

export default withAuth;
