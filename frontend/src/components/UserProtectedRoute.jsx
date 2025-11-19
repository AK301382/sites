import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
