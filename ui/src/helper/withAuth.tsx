import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from '../../pages/_app';
import useAuth from '../hooks/useAuth';

const withAuth = (WrappedComponent: any) => {
  const AuthComponent: NextPageWithLayout = (props) => {
    const [isClient, setIsClient] = useState(false);
    const { isAuth, check } = useAuth();

    useEffect(() => {
      setIsClient(true);
      if (isClient) {
        check();
      }
    }, [isClient]);

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
