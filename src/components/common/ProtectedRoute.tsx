// src/components/common/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWeb3Auth } from '../../contexts/Web3Context';
import { authService } from '../../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'institution' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, userRole, refreshUserInfo } = useWeb3Auth();
  const location = useLocation();

  // Verify token validity on route access
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Only check if we have a token
        if (localStorage.getItem('token')) {
          // Try to get user profile to verify token validity
          await authService.getProfile();
        }
      } catch (error) {
        // If request fails due to invalid token, log the user out
        if (error.response?.status === 401) {
          console.log('Token expired or invalid, logging out');
          localStorage.removeItem('token');
          refreshUserInfo(); // Update auth context
        }
      }
    };

    verifyToken();
  }, [location.pathname, refreshUserInfo]);

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