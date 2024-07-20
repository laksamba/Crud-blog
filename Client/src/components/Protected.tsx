import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  isAuth: boolean;
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ isAuth, children }) => {
  if (isAuth) {
    return <>{children}</>;
  } else {
    return <Navigate to='/login' />;
  }
};

export default Protected;
