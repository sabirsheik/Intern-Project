import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const NotificationsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Task Assigned',
      description: 'You have been assigned a new task: Build a Responsive Portfolio Website',
      timestamp: '4/7/2026, 12:09:21 PM',
      type: 'task',
      read: false,
      icon: '📋'
    },
    {
      id: 2,
      title: 'Submission Graded',
      description: 'Your submission has been graded. Score: 85/100',
      timestamp: '4/6/2026, 12:09:21 PM',
      type: 'grade',
      read: false,
      icon: '📝'
    },
    {
      id: 3,
      title: 'Certificate Available',
      description: 'Your Web Development Internship certificate is now available for download',
      timestamp: '4/5/2026, 10:30:00 AM',
      type: 'certificate',
      read: true,
      icon: '📜'
    },
    {
      id: 4,
      title: 'Attendance Marked',
      description: 'Your attendance for April 5, 2026 has been marked as Present',
      timestamp: '4/5/2026, 05:45:30 PM',
      type: 'attendance',
      read: true,
      icon: '✓'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  // Count notifications
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      read: notifications.filter(n => n.read).length
    };
  }, [notifications]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    toast.success('✓ Marked as read');
  };

  const handleMarkAsUnread = (id) => {
    setNotifications(
      notifications.map(n =>
        n.id === id ? { ...n, read: false } : n
      )
    );
    toast.success('✓ Marked as unread');
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('✓ Notification deleted');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('✓ All notifications marked as read');
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
                  item.label === 'Notifications'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                {item.label}
                {item.label === 'Notifications' && counts.unread > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white font-bold">{counts.unread}</span>
                )}
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
              <h1 className="text-4xl font-extrabold">Notifications</h1>
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
              <h2 className="text-3xl md:text-4xl font-bold">Notifications</h2>
              <p className="text-slate-600 mt-1">Stay updated with your internship activities</p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-200"
            >
              {[
                { key: 'all', label: 'All', count: counts.all },
                { key: 'unread', label: 'Unread', count: counts.unread },
                { key: 'read', label: 'Read', count: counts.read }
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      activeFilter === filter.key
                        ? 'bg-slate-700'
                        : 'bg-slate-300'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>

            {/* Notifications Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {activeFilter === 'all'
                      ? 'All Notifications'
                      : activeFilter === 'unread'
                      ? 'Unread Notifications'
                      : 'Read Notifications'}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    {activeFilter === 'all'
                      ? 'Your complete notification history'
                      : activeFilter === 'unread'
                      ? 'Notifications you haven\'t read yet'
                      : 'Notifications you\'ve already viewed'}
                  </p>
                </div>
                {activeFilter === 'unread' && counts.unread > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Mark all as read
                  </motion.button>
                )}
              </div>

              {/* Notifications List or Empty State */}
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition cursor-pointer ${
                        notification.read
                          ? 'border-slate-200 bg-white'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                      onClick={() =>
                        !notification.read && handleMarkAsRead(notification.id)
                      }
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 text-3xl mt-1">{notification.icon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-lg">{notification.title}</h4>
                        <p className="text-slate-600 text-sm mt-1">{notification.description}</p>
                        <p className="text-slate-500 text-xs mt-3">{notification.timestamp}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-2">
                        {!notification.read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            title="Mark as read"
                            className="text-slate-400 hover:text-slate-600 transition text-lg"
                          >
                            ●
                          </motion.button>
                        )}
                        {notification.read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsUnread(notification.id);
                            }}
                            title="Mark as unread"
                            className="text-slate-400 hover:text-slate-600 transition text-lg"
                          >
                            ○
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          title="Delete notification"
                          className="text-slate-400 hover:text-red-600 transition text-lg"
                        >
                          ✕
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-slate-200 bg-white p-12 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    <span className="text-6xl">✓</span>
                  </motion.div>
                  <p className="text-2xl font-bold text-slate-900 mt-4">
                    {activeFilter === 'unread'
                      ? 'All caught up!'
                      : activeFilter === 'read'
                      ? 'No read notifications'
                      : 'No notifications'}
                  </p>
                  <p className="text-slate-600 mt-2">
                    {activeFilter === 'unread'
                      ? 'No unread notifications'
                      : activeFilter === 'read'
                      ? 'You have no read notifications'
                      : 'You have no notifications'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
