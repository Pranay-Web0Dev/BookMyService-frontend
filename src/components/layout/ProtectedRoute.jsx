// src/components/layout/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = 
      user?.role === 'superadmin' ? '/superadmin/dashboard' :
      user?.role === 'admin' ? '/admin/dashboard' :
      user?.role === 'serviceman' ? '/serviceman/dashboard' :
      '/user/dashboard';
    
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;