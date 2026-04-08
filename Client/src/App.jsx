import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InternDashboardPage from './pages/InternDashboardPage';
import TaskManagementPage from './pages/TaskManagementPage';
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
      
      {/* Tasks route - accessible to all authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TaskManagementPage />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Route>

      {/* Superadmin routes */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
        <Route path="/dashboard/superadmin" element={<DashboardPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<DashboardPage />} />
      </Route>

      {/* Intern routes */}
      <Route element={<ProtectedRoute allowedRoles={['intern']} />}>
        <Route path="/dashboard/intern" element={<InternDashboardPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
