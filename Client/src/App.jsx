import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminTasksPage from './pages/AdminTasksPage';
import InternDashboardPage from './pages/InternDashboardPage';
import TaskManagementPage from './pages/TaskManagementPage';
import AttendancePage from './pages/AttendancePage';
import CertificatePage from './pages/CertificatePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
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
      
      {/* All authenticated user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TaskManagementPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/certificates" element={<CertificatePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Route>

      {/* Superadmin routes */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
        <Route path="/dashboard/superadmin" element={<DashboardPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/tasks" element={<AdminTasksPage />} />
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
