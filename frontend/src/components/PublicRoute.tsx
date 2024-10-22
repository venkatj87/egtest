import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';


// PublicRoute component that redirects to the home page if the user is logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/home" /> : <>{children}</>;
};

export default PublicRoute;