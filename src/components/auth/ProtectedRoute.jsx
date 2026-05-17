import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Loading e-Samadhan AI...</p>
            </div>
      </div>
);

// Requires authentication
export const ProtectedRoute = ({ children }) => {
      const { isAuthenticated, initializing } = useAuth();
      const location = useLocation();
      if (initializing) return <Spinner />;
      if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
      return children;
};

// Requires specific role(s)
export const RoleRoute = ({ children, roles }) => {
      const { user, isAuthenticated, initializing } = useAuth();
      const location = useLocation();
      if (initializing) return <Spinner />;
      if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
      if (!roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
      return children;
};

// Redirect already-authenticated users away from auth pages
export const PublicRoute = ({ children }) => {
      const { isAuthenticated, user, initializing, getDashboardPath } = useAuth();
      // Don't redirect while verifying — just show the auth page
      if (initializing) return children;
      if (isAuthenticated) return <Navigate to={getDashboardPath(user?.role)} replace />;
      return children;
};
