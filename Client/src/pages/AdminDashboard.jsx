import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Statistics
  const stats = {
    totalInterns: 8,
    activeTasks: 5,
    pendingReviews: 1,
    avgGrade: 78.0,
    domainStatus: 'Active',
    change: { interns: '+5%', tasks: '+3', reviews: '↓2', grade: '+25%' }
  };

  // Interns Data
  const interns = [
    { id: 1, name: 'Harper Lewis', email: 'harper.lewis35@email.com', avatar: '👨', tasks: 3, completed: 1, grade: 78.0 },
    { id: 2, name: 'Michael Brown', email: 'michael.brown@email.com', avatar: '👨', tasks: 0, completed: 0, grade: 0.0 },
    { id: 3, name: 'Mia Harris', email: 'mia.harris8@email.com', avatar: '👩', tasks: 1, completed: 0, grade: 0.0 },
    { id: 4, name: 'Oliver Rodriguez', email: 'oliver.rodriguez15@email.com', avatar: '👨', tasks: 5, completed: 0, grade: 0.0 },
    { id: 5, name: 'Noah Brown', email: 'noah.brown22@email.com', avatar: '👨', tasks: 5, completed: 0, grade: 0.0 },
    { id: 6, name: 'Ethan Martin', email: 'ethan.martin29@email.com', avatar: '👨', tasks: 2, completed: 0, grade: 0.0 }
  ];

  // Submissions Data
  const submissions = [
    { id: 1, type: 'Task Submission', date: '4/7/2026', intern: 'Harper Lewis', status: 'pending' }
  ];

  // Weekly Progress Data
  const weeklyData = [
    { week: 'Week 1', assigned: 12, completed: 13 },
    { week: 'Week 2', assigned: 25, completed: 15 },
    { week: 'Week 3', assigned: 10, completed: 7 },
    { week: 'Week 4', assigned: 30, completed: 8 },
    { week: 'Week 5', assigned: 10, completed: 8 },
    { week: 'Week 6', assigned: 20, completed: 15 },
    { week: 'Week 7', assigned: 25, completed: 24 },
    { week: 'Week 8', assigned: 24, completed: 10 }
  ];

  // Top Performers
  const topPerformers = [
    { id: 1, name: 'Harper Lewis', avatar: '👨', tasksCompleted: 1, percentage: 78.0 },
    { id: 2, name: 'Michael Brown', avatar: '👨', tasksCompleted: 0, percentage: 0.0 },
    { id: 3, name: 'Mia Harris', avatar: '👩', tasksCompleted: 0, percentage: 0.0 },
    { id: 4, name: 'Oliver Rodriguez', avatar: '👨', tasksCompleted: 0, percentage: 0.0 },
    { id: 5, name: 'Noah Brown', avatar: '👨', tasksCompleted: 0, percentage: 0.0 }
  ];

  const handleCreateTask = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✓ Create Task dialog opened');
    } catch (error) {
      toast.error('Failed to open create task');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`✓ ${action} action initiated`);
    } catch (error) {
      toast.error(`Failed to perform ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmission = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✓ Opening submission for review');
    } catch (error) {
      toast.error('Failed to open submission');
    } finally {
      setLoading(false);
    }
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
                  item.label === 'Dashboard'
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
              <h1 className="text-4xl font-extrabold">Dashboard</h1>
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
                <h2 className="text-4xl md:text-5xl font-bold">Welcome back, Sarah!</h2>
                <p className="text-slate-600 mt-2">Managing Web Development • 8 interns</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-semibold text-sm">
                  ✓ Domain Active
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateTask}
                  disabled={loading}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Create Task <span>→</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8"
            >
              {[
                { title: 'Total Interns', value: stats.totalInterns, icon: '👥', change: stats.change.interns, unit: 'Active in domain' },
                { title: 'Active Tasks', value: stats.activeTasks, icon: '📋', change: stats.change.tasks, unit: 'Currently running' },
                { title: 'Pending Reviews', value: stats.pendingReviews, icon: '📝', change: stats.change.reviews, unit: 'Submissions waiting' },
                { title: 'Avg Grade', value: stats.avgGrade + '%', icon: '📊', change: stats.change.grade, unit: 'Domain average' }
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-600">{card.title}</p>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <p className="text-4xl font-bold text-slate-900">{card.value}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-2">{card.change}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.unit}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex rounded-xl bg-slate-200 p-1 mb-8"
            >
              {['Overview', 'Interns', 'Submissions', 'Analytics'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-white text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Weekly Progress */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-2xl font-bold mb-2">Weekly Progress</h3>
                      <p className="text-slate-600 text-sm mb-6">Tasks and submissions over the past 8 weeks</p>
                      
                      <svg viewBox="0 0 360 200" className="w-full h-64">
                        <line x1="30" y1="145" x2="340" y2="145" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="30" y1="20" x2="30" y2="145" stroke="#e2e8f0" strokeWidth="1" />
                        
                        {[25, 50, 75, 100].map((val) => (
                          <g key={`grid-${val}`}>
                            <text x="25" y={145 - (val / 100) * 125 + 5} fontSize="12" fill="#94a3b8" textAnchor="end">{val}</text>
                            <line x1="30" y1={145 - (val / 100) * 125} x2="340" y2={145 - (val / 100) * 125} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />
                          </g>
                        ))}

                        {weeklyData.map((data, idx) => {
                          const x = 30 + idx * 40;
                          const y1 = 145 - (data.assigned / 32) * 100;
                          const y2 = 145 - (data.completed / 32) * 100;
                          return (
                            <g key={`week-${idx}`}>
                              <rect x={x - 5} y={y1} width="7" height={145 - y1} fill="#3b82f6" />
                              <rect x={x + 3} y={y2} width="7" height={145 - y2} fill="#10b981" />
                              <text x={x + 1} y="165" fontSize="10" fill="#94a3b8" textAnchor="middle">{data.week}</text>
                            </g>
                          );
                        })}
                      </svg>

                      <div className="flex gap-8 mt-6 justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500" />
                          <span className="text-sm text-slate-600">Tasks Assigned</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500" />
                          <span className="text-sm text-slate-600">Tasks Completed</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Grade Distribution */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-2xl font-bold mb-2">Grade Distribution</h3>
                      <p className="text-slate-600 text-sm mb-8">Performance breakdown of all submissions</p>
                      
                      <div className="flex items-center justify-center">
                        <svg viewBox="0 0 200 200" className="w-48 h-48">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="30" />
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="30"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.7} ${2 * Math.PI * 80 * 0.3}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 100 100)"
                          />
                        </svg>
                      </div>

                      <p className="text-center mt-6">
                        <span className="text-2xl font-bold text-slate-900">●</span>
                        <span className="text-slate-600 ml-2">Average (70-79%)</span>
                      </p>
                    </motion.div>
                  </div>

                  {/* Top Performers */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-2xl font-bold mb-2">⭐ Top Performers</h3>
                      <p className="text-slate-600 text-sm mb-6">Highest performing interns in your domain</p>
                      
                      <div className="space-y-4">
                        {topPerformers.map((performer, idx) => (
                          <div key={performer.id} className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div className="text-2xl">{performer.avatar}</div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{performer.name}</p>
                              <p className="text-xs text-slate-500">{performer.tasksCompleted} tasks completed</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-slate-900 h-2 rounded-full"
                                  style={{ width: `${performer.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-900 w-12 text-right">{performer.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
                      <p className="text-slate-600 text-sm mb-6">Common tasks for domain management</p>
                      
                      <div className="space-y-3">
                        {[
                          { icon: '📋', label: 'Create New Task', action: 'create_task' },
                          { icon: '👥', label: 'Assign Task to Interns', action: 'assign_task' },
                          { icon: '📝', label: 'Review Pending Submissions', action: 'review_submissions', badge: 1 },
                          { icon: '📊', label: 'Generate Domain Report', action: 'generate_report' }
                        ].map((item) => (
                          <motion.button
                            key={item.action}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickAction(item.label)}
                            disabled={loading}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="flex-1 font-semibold text-slate-900">{item.label}</span>
                            {item.badge && (
                              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">{item.badge}</span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* INTERNS TAB */}
              {activeTab === 'interns' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-2xl font-bold mb-2">Domain Interns</h3>
                  <p className="text-slate-600 text-sm mb-6">All interns in Web Development</p>

                  <div className="space-y-4">
                    {interns.map((intern, idx) => (
                      <motion.div
                        key={intern.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">{intern.avatar}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{intern.name}</p>
                            <p className="text-sm text-slate-500">{intern.email}</p>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div>
                              <p className="text-slate-600">{intern.tasks} tasks</p>
                              <p className="font-semibold text-slate-900">{intern.completed} completed</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">{intern.grade.toFixed(1)}%</p>
                          <p className="text-xs text-slate-500">Average Grade</p>
                          <div className="w-32 bg-slate-200 rounded-full h-2 mt-2">
                            <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${intern.grade}%` }} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SUBMISSIONS TAB */}
              {activeTab === 'submissions' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-2xl font-bold mb-2">Pending Submissions</h3>
                  <p className="text-slate-600 text-sm mb-6">Submissions waiting for your review</p>

                  {submissions.length > 0 ? (
                    <div className="space-y-4">
                      {submissions.map((submission, idx) => (
                        <motion.div
                          key={submission.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">📋</span>
                            <div>
                              <p className="font-semibold text-slate-900">{submission.type}</p>
                              <p className="text-sm text-slate-500">Submitted {submission.date}</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReviewSubmission(submission.id)}
                            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center gap-2"
                          >
                            Review <span>→</span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-slate-500">No pending submissions</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ANALYTICS TAB */}
              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <p className="text-slate-600 text-sm mb-4">Completion Rate</p>
                      <p className="text-4xl font-bold text-slate-900 mb-2">4.8%</p>
                      <p className="text-xs text-slate-500">1 of 5 tasks completed</p>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                        <div className="bg-slate-900 h-2 rounded-full" style={{ width: '4.8%' }} />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <p className="text-slate-600 text-sm mb-4">Average Grade</p>
                      <p className="text-4xl font-bold text-slate-900 mb-2">78.0%</p>
                      <p className="text-xs text-slate-500">Across all graded submissions</p>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                        <div className="bg-slate-900 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <p className="text-slate-600 text-sm mb-4">Submissions This Week</p>
                      <p className="text-4xl font-bold text-slate-900 mb-2">8</p>
                      <p className="text-xs text-emerald-600 font-semibold">↑ +15% from last week</p>
                    </motion.div>
                  </div>

                  {/* Performance Trends Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <h3 className="text-2xl font-bold mb-2">Performance Trends</h3>
                    <p className="text-slate-600 text-sm mb-6">8-week performance analysis</p>

                    <svg viewBox="0 0 1200 450" className="w-full h-80">
                      {/* Y-axis */}
                      <line x1="60" y1="30" x2="60" y2="380" stroke="#e2e8f0" strokeWidth="2" />
                      {/* X-axis */}
                      <line x1="60" y1="380" x2="1150" y2="380" stroke="#e2e8f0" strokeWidth="2" />

                      {/* Grid lines and labels */}
                      {[0, 8, 16, 24, 32].map((val) => (
                        <g key={`grid-y-${val}`}>
                          <line x1="60" y1={380 - (val / 32) * 340} x2="1150" y2={380 - (val / 32) * 340} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" />
                          <text x="50" y={380 - (val / 32) * 340 + 5} fontSize="12" fill="#94a3b8" textAnchor="end">{val}</text>
                        </g>
                      ))}

                      {/* Bars */}
                      {weeklyData.map((data, idx) => {
                        const x = 100 + idx * 130;
                        const y1 = 380 - (data.assigned / 32) * 340;
                        const y2 = 380 - (data.completed / 32) * 340;
                        return (
                          <g key={`bar-${idx}`}>
                            <rect x={x - 20} y={y1} width="35" height={380 - y1} fill="#3b82f6" rx="4" />
                            <rect x={x + 20} y={y2} width="35" height={380 - y2} fill="#10b981" rx="4" />
                            <text x={x} y="410" fontSize="12" fill="#94a3b8" textAnchor="middle">{data.week}</text>
                          </g>
                        );
                      })}
                    </svg>

                    <div className="flex gap-8 mt-6 justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded" />
                        <span className="text-sm text-slate-600">Tasks Assigned</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-500 rounded" />
                        <span className="text-sm text-slate-600">Tasks Completed</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
