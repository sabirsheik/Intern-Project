import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const AdminUsersPage = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alexandra Chen',
      email: 'alexandra.chen@internportal.com',
      role: 'super-admin',
      domain: null,
      status: 'active',
      joinedDate: '2/11/2026',
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      email: 'marcus.j@internportal.com',
      role: 'domain-admin',
      domain: 'Cyber Security',
      status: 'active',
      joinedDate: '2/25/2026',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah.w@internportal.com',
      role: 'domain-admin',
      domain: 'Web Development',
      status: 'active',
      joinedDate: '2/25/2026',
      avatar: '👩'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.r@internportal.com',
      role: 'domain-admin',
      domain: 'Graphic Design',
      status: 'active',
      joinedDate: '3/4/2026',
      avatar: '👩'
    },
    {
      id: 5,
      name: 'Dr. James Park',
      email: 'james.p@internportal.com',
      role: 'domain-admin',
      domain: 'AI / Machine Learning',
      status: 'active',
      joinedDate: '3/4/2026',
      avatar: '👨'
    },
    {
      id: 6,
      name: 'Lisa Thompson',
      email: 'lisa.t@internportal.com',
      role: 'reviewer',
      domain: 'Web Development',
      status: 'active',
      joinedDate: '3/11/2026',
      avatar: '👩'
    },
    {
      id: 7,
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      role: 'intern',
      domain: 'Web Development',
      status: 'active',
      joinedDate: '3/18/2026',
      avatar: '👨'
    },
    {
      id: 8,
      name: 'Jessica Davis',
      email: 'jessica.davis@email.com',
      role: 'intern',
      domain: 'Cyber Security',
      status: 'active',
      joinedDate: '3/18/2026',
      avatar: '👩'
    },
    {
      id: 9,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      role: 'intern',
      domain: 'AI / Machine Learning',
      status: 'active',
      joinedDate: '3/25/2026',
      avatar: '👨'
    },
    {
      id: 10,
      name: 'Amanda Martinez',
      email: 'amanda.m@email.com',
      role: 'intern',
      domain: 'Graphic Design',
      status: 'active',
      joinedDate: '3/25/2026',
      avatar: '👩'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all-roles');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'intern',
    domain: ''
  });

  const domains = [
    'Web Development',
    'Cyber Security',
    'Graphic Design',
    'AI / Machine Learning',
    'Mobile Development'
  ];

  const roleOptions = [
    { value: 'super-admin', label: 'Super Admin', color: 'bg-red-100 text-red-700' },
    { value: 'domain-admin', label: 'Domain Admin', color: 'bg-slate-900 text-white' },
    { value: 'reviewer', label: 'Reviewer', color: 'bg-slate-600 text-white' },
    { value: 'intern', label: 'Intern', color: 'bg-slate-700 text-white' }
  ];

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all-roles' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        domain: formData.role === 'super-admin' ? null : formData.domain,
        status: 'active',
        joinedDate: new Date().toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' }).replace(/\//g, '/'),
        avatar: formData.fullName.charAt(0) === 'M' || formData.fullName.charAt(0) === 'J' || formData.fullName.charAt(0) === 'D' ? '👨' : '👩'
      };

      setUsers([...users, newUser]);
      setFormData({ fullName: '', email: '', password: '', role: 'intern', domain: '' });
      setShowModal(false);
      toast.success(`✓ User ${newUser.name} added successfully!`);
    } catch (error) {
      toast.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const deletedUser = users.find(u => u.id === id);
        setUsers(users.filter(u => u.id !== id));
        toast.success(`✓ User ${deletedUser?.name} deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption?.color || 'bg-slate-700 text-white';
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[245px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-white">{'</>'}</div>
              <div>
                <p className="text-2xl font-extrabold leading-none">Intern Portal</p>
                <p className="text-xs text-slate-500">Enterprise</p>
              </div>
            </div>
          </div>

          <nav className="px-3 pb-6 pt-2">
            {[
              { label: 'Dashboard', route: '/dashboard/admin' },
              { label: 'Users', route: '/admin/users' },
              { label: 'Tasks', route: '/admin/tasks' },
              { label: 'Submissions', route: '/admin/submissions' },
              { label: 'Analytics', route: '/admin/analytics' },
              { label: 'Attendance', route: '/admin/attendance' },
              { label: 'Certificates', route: '/admin/certificates' },
              { label: 'Notifications', route: '/admin/notifications' },
              { label: 'Settings', route: '/admin/settings' }
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.route)}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  item.label === 'Users'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-200" />
              <div>
                <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">Domain Admin</p>
              </div>
              <button type="button" onClick={logout} className="ml-auto text-sm font-bold text-slate-500 hover:text-slate-800">
                ⚙
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-4xl font-extrabold">User Management</h1>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 md:w-64"
                />
                <button type="button" className="text-lg">◔</button>
                <button type="button" className="relative text-lg">🔔<span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">1</span></button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-start justify-between"
            >
              <div>
                <h2 className="text-4xl font-bold">User Management</h2>
                <p className="text-slate-600 mt-2">Manage users across all domains</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center gap-2"
              >
                <span>+</span> Add User
              </motion.button>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition bg-white font-semibold"
              >
                <option value="all-roles">All Roles</option>
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </motion.div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-2xl font-bold">All Users ({filteredUsers.length})</h3>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">User</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Domain</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, idx) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-200 hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{u.avatar}</div>
                            <div>
                              <p className="font-semibold text-slate-900">{u.name}</p>
                              <p className="text-sm text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(u.role)}`}
                          >
                            {roleOptions.find(r => r.value === u.role)?.label}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {u.domain && (
                              <>
                                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                                <span className="text-sm text-slate-600">{u.domain}</span>
                              </>
                            )}
                            {!u.domain && <span className="text-sm text-slate-400">-</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white"
                          >
                            ● {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{u.joinedDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-slate-500 hover:text-slate-900 transition"
                              onClick={() => toast.info('Edit user: ' + u.name)}
                            >
                              ✏️
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-red-500 hover:text-red-700 transition"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              🗑️
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-slate-500 hover:text-slate-900 transition"
                            >
                              ⋯
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Add New User</h2>
                  <p className="text-slate-600 text-sm mt-1">Create a new user account</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-900 text-2xl"
                >
                  ✕
                </motion.button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition bg-white"
                  >
                    {roleOptions.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                {formData.role !== 'super-admin' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Domain</label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition bg-white"
                    >
                      <option value="">Select domain</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;
