import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InternDashboardPage from './pages/InternDashboardPage';
import { useAuth } from './context/AuthContext';

const roleDashboardPath = {
  superadmin: '/dashboard/superadmin',
  admin: '/dashboard/admin',
  intern: '/dashboard/intern'
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={roleDashboardPath[user?.role] || '/'} replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
        <Route path="/dashboard/superadmin" element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<DashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['intern']} />}>
        <Route path="/dashboard/intern" element={<InternDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
