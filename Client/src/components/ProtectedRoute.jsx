import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleDashboardPath = {
  superadmin: '/dashboard/superadmin',
  admin: '/dashboard/admin',
  intern: '/dashboard/intern'
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role check if specific roles required
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      // User doesn't have permission - redirect to their role dashboard
      return <Navigate to={roleDashboardPath[user?.role] || '/'} replace />;
    }
  }

  // All checks passed - render route
  return <Outlet />;
};

export default ProtectedRoute;
