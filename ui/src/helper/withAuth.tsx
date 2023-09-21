import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { NextPageWithLayout } from '../../pages/_app';

const withAuth = (WrappedComponent: any) => {
  const AuthComponent: NextPageWithLayout = (props) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (isClient && !isAuthenticated()) {
        router.push('/login');
      }
    }, [isClient]);

    const isAuthenticated = () => {
      if (!isClient) {
        
      }
      return localStorage.getItem('token') ? true : false;
    };

    if (!isClient) {
      return null;
    }

    if (!isAuthenticated()) {
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
