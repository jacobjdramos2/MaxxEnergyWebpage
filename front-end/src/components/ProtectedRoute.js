import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if user has at least one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    // Extract roles from authorities
    const userRoles = user.authorities.map(auth => {
      // Remove "ROLE_" prefix if it exists
      return auth.authority.replace('ROLE_', '');
    });

    const hasAllowedRole = userRoles.some(role => 
      allowedRoles.includes(role.toUpperCase())
    );

    if (!hasAllowedRole) {
      // User doesn't have the required role, redirect to unauthorized page
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;
