// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWeb3Auth } from '../../contexts/Web3Context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'institution' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, userRole } = useWeb3Auth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in, redirect to home with return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If a specific role is required and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required role (if any)
  return <>{children}</>;
};

export default ProtectedRoute;