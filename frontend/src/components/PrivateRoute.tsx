// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return isAuthenticated() ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace /> // Redirect to login page if not authenticated
  );
};

export default PrivateRoute;
