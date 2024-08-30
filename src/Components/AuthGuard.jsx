import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children, redirectPath = '/' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authEmail = localStorage.getItem('auth_email');

    if (!authEmail) {
      navigate(redirectPath);
    }
  }, [navigate, redirectPath]);

  // Return null or a loading spinner while checking
  return <>{children}</>;
};

export default AuthGuard;
