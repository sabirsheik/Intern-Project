import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0201',
    role: 'intern',
    bio: 'Computer Science student passionate about web development.'
  });

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    pushNotifications: false,
    taskReminders: false,
    gradeUpdates: false,
    deadlineAlerts: false,
    weeklyDigest: false
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'english'
  });

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorState, setTwoFactorState] = useState({
    enabled: false
  });

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✓ Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhoto = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('✓ Photo updated successfully');
    } catch (error) {
      toast.error('Failed to update photo');
    }
  };

  // Notification handlers
  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✓ Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  // Appearance handlers
  const handleThemeChange = (theme) => {
    setAppearance(prev => ({ ...prev, theme }));
    toast.success(`✓ Theme changed to ${theme}`);
  };

  const handleLanguageChange = (e) => {
    setAppearance(prev => ({ ...prev, language: e.target.value }));
  };

  // Security handlers
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (securityData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('✓ Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorState({ enabled: !twoFactorState.enabled });
      toast.success(`✓ 2FA ${!twoFactorState.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Account deleted successfully');
        logout();
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
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
              { label: 'Dashboard', route: '/dashboard/intern' },
              { label: 'Tasks', route: '/tasks' },
              { label: 'Attendance', route: '/attendance' },
              { label: 'Certificates', route: '/certificates' },
              { label: 'Notifications', route: '/notifications' },
              { label: 'Settings', route: '/settings' }
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.route !== '#' && navigate(item.route)}
                disabled={item.route === '#'}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  item.label === 'Settings'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-200" />
              <div>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">Intern</p>
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
              <h1 className="text-4xl font-extrabold">Settings</h1>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 md:w-64"
                />
                <button type="button" className="text-lg">◔</button>
                <button type="button" className="relative text-lg">⌂</button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Settings</h2>
              <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-slate-200"
            >
              {[
                { key: 'profile', label: 'Profile', icon: '👤' },
                { key: 'notifications', label: 'Notifications', icon: '🔔' },
                { key: 'appearance', label: 'Appearance', icon: '🎨' },
                { key: 'security', label: 'Security', icon: '🔒' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={tabVariants}
              transition={{ duration: 0.3 }}
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h3 className="text-2xl font-bold mb-2">Profile Information</h3>
                  <p className="text-slate-600 mb-8">Update your personal information and profile picture</p>

                  {/* Photo Section */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <div className="flex items-center gap-6">
                      <div className="text-8xl">👤</div>
                      <div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleChangePhoto}
                          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition mb-3"
                        >
                          📷 Change Photo
                        </motion.button>
                        <p className="text-slate-600 text-sm">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
                        <input
                          type="text"
                          value={profileData.role.toUpperCase()}
                          disabled
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      💾 {loading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h3 className="text-2xl font-bold mb-2">Notification Preferences</h3>
                  <p className="text-slate-600 mb-8">Choose how you want to be notified</p>

                  {/* Notification Channels */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <h4 className="text-lg font-bold mb-6">Notification Channels</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                          <div>
                            <p className="font-semibold text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNotificationToggle(item.key)}
                            className={`relative w-14 h-8 rounded-full transition ${
                              notificationSettings[item.key]
                                ? 'bg-slate-900'
                                : 'bg-slate-300'
                            }`}
                          >
                            <motion.div
                              animate={{
                                x: notificationSettings[item.key] ? 24 : 4
                              }}
                              className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full"
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-6">Notification Types</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'taskReminders', label: 'Task Reminders', desc: 'Get reminded about upcoming deadlines' },
                        { key: 'gradeUpdates', label: 'Grade Updates', desc: 'Notify when grades are published' },
                        { key: 'deadlineAlerts', label: 'Deadline Alerts', desc: 'Urgent alerts for approaching deadlines' },
                        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of activities' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                          <div>
                            <p className="font-semibold text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNotificationToggle(item.key)}
                            className={`relative w-14 h-8 rounded-full transition ${
                              notificationSettings[item.key]
                                ? 'bg-slate-900'
                                : 'bg-slate-300'
                            }`}
                          >
                            <motion.div
                              animate={{
                                x: notificationSettings[item.key] ? 24 : 4
                              }}
                              className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full"
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      💾 {loading ? 'Saving...' : 'Save Preferences'}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h3 className="text-2xl font-bold mb-2">Appearance</h3>
                  <p className="text-slate-600 mb-8">Customize how the application looks</p>

                  {/* Theme Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-900 mb-4">Theme</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'light', label: 'Light', icon: '☀️' },
                        { key: 'dark', label: 'Dark', icon: '🌙' }
                      ].map((theme) => (
                        <motion.button
                          key={theme.key}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleThemeChange(theme.key)}
                          className={`p-6 rounded-xl border-2 transition text-center font-semibold ${
                            appearance.theme === theme.key
                              ? 'border-slate-900 bg-slate-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="text-4xl mb-3">{theme.icon}</div>
                          {theme.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-4">Language</label>
                    <select
                      value={appearance.language}
                      onChange={handleLanguageChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                    >
                      <option value="english">🌐 English</option>
                      <option value="spanish">Español</option>
                      <option value="french">Français</option>
                      <option value="german">Deutsch</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h3 className="text-2xl font-bold mb-2">Security Settings</h3>
                  <p className="text-slate-600 mb-8">Manage your account security</p>

                  {/* Change Password */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <h4 className="text-lg font-bold mb-6">Change Password</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        🔐 {loading ? 'Updating...' : 'Update Password'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <h4 className="text-lg font-bold mb-6">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                      <div>
                        <p className="font-semibold text-slate-900">Authenticator App</p>
                        <p className="text-sm text-slate-600">Use an authenticator app for 2FA</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEnable2FA}
                        disabled={loading}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {twoFactorState.enabled ? 'Disable' : 'Enable'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-red-600">Danger Zone</h4>
                    <p className="text-slate-600 mb-4">Irreversible actions</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      🗑️ Delete Account
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
