import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const statusClassMap = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-slate-900 text-white',
  completed: 'bg-emerald-100 text-emerald-700'
};

const statusLabelMap = {
  pending: 'pending',
  in_progress: 'in progress',
  completed: 'completed'
};

const toDeadline = (value) => {
  if (!value) {
    return 'No deadline';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'No deadline';
  }
  return date.toLocaleDateString('en-GB');
};

const InternDashboardPage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [savingProfile, setSavingProfile] = useState(false);

  const [pagination, setPagination] = useState({ page: 1, limit: 6, totalPages: 1, total: 0 });
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });

  const fetchData = async ({ page = pagination.page, silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const [dashboardResponse, tasksResponse, notificationsResponse] = await Promise.all([
        axiosClient.get('/intern/dashboard'),
        axiosClient.get(`/intern/tasks?page=${page}&limit=${pagination.limit}`),
        axiosClient.get('/intern/notifications')
      ]);

      setDashboard(dashboardResponse.data);
      setTasks(tasksResponse.data.data || []);
      setPagination((prev) => ({
        ...prev,
        ...tasksResponse.data.pagination
      }));
      setNotifications(notificationsResponse.data || []);

      const profile = dashboardResponse.data?.user;
      if (profile) {
        setProfileForm({ name: profile.name || '', email: profile.email || '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load intern dashboard');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData({ silent: true });
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axiosClient.patch(`/intern/tasks/${taskId}/status`, { status });
      toast.success('Task status updated');
      fetchData({ silent: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const submitTask = async (taskId) => {
    try {
      await axiosClient.post(`/intern/tasks/${taskId}/submit`);
      toast.success('Task submitted successfully');
      fetchData({ silent: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit task');
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const response = await axiosClient.patch('/intern/profile', profileForm);
      const token = localStorage.getItem('token');
      login({ token, user: response.data.user });
      toast.success('Profile updated');
      fetchData({ silent: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchData({ page: pagination.page + 1 });
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      fetchData({ page: pagination.page - 1 });
    }
  };

  const summary = dashboard?.summary || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    averageGrade: 0,
    notificationsCount: 0
  };

  const taskCompletionPercent = summary.totalTasks === 0 ? 0 : Math.round((summary.completedTasks / summary.totalTasks) * 100);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'tasks') {
      return tasks;
    }
    if (activeTab === 'progress') {
      return tasks.filter((task) => task.status === 'in_progress' || task.status === 'pending');
    }
    return tasks.filter((task) => task.status === 'completed');
  }, [tasks, activeTab]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
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
              { label: 'Attendance', route: '#' },
              { label: 'Certificates', route: '#' },
              { label: 'Notifications', route: '#' },
              { label: 'Settings', route: '#' }
            ].map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.route !== '#' && navigate(item.route)}
                disabled={item.route === '#'}
                className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  index === 0
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                {item.label}
                {item.label === 'Notifications' && summary.notificationsCount > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">{summary.notificationsCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-200" />
              <div>
                <p className="text-sm font-bold text-slate-900">{dashboard?.user?.name || user?.name}</p>
                <p className="text-xs text-slate-500">Intern</p>
              </div>
              <button type="button" onClick={logout} className="ml-auto text-sm font-bold text-slate-500 hover:text-slate-800">

              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
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
                <button type="button" className="relative text-lg">
                  ⌂
                  {summary.notificationsCount > 0 && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />}
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="space-y-4">
                <div className="h-10 w-80 animate-pulse rounded bg-slate-200" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                  ))}
                </div>
                <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-5xl font-extrabold">Welcome back, {dashboard?.user?.name?.split(' ')[0] || 'Intern'}!</h2>
                    <p className="mt-1 text-lg text-slate-500">{dashboard?.highlights?.subtitle}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700">
                    ☆ {Number(summary.averageGrade || 0).toFixed(1)}% Avg
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { title: 'Total Tasks', value: summary.totalTasks, subtitle: 'Assigned to you' },
                    { title: 'Completed', value: summary.completedTasks, subtitle: `${taskCompletionPercent}%` },
                    { title: 'In Progress', value: summary.inProgressTasks, subtitle: 'Currently working' },
                    { title: 'Average Grade', value: `${Number(summary.averageGrade || 0).toFixed(1)}%`, subtitle: dashboard?.highlights?.trendChange }
                  ].map((card) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-base font-semibold text-slate-700">{card.title}</p>
                      <p className="mt-4 text-5xl font-extrabold">{card.value}</p>
                      <p className="mt-1 text-sm text-slate-500">{card.subtitle}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tasks')}
                    className={`rounded-lg px-4 py-2 ${activeTab === 'tasks' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
                  >
                    My Tasks
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('progress')}
                    className={`rounded-lg px-4 py-2 ${activeTab === 'progress' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
                  >
                    Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('grades')}
                    className={`rounded-lg px-4 py-2 ${activeTab === 'grades' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
                  >
                    Grades
                  </button>
                </div>

                {activeTab === 'tasks' && (
                  <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-3xl font-bold">Upcoming Tasks</h3>
                    <p className="text-sm text-slate-500">Tasks that need your attention</p>

                    <div className="mt-4 space-y-3">
                      {(dashboard?.upcomingTasks || []).map((task) => (
                        <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="text-2xl font-bold">{task.title}</h4>
                              <p className="text-lg text-slate-500">{task.description}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className={`rounded-full px-2 py-1 font-semibold ${statusClassMap[task.status]}`}>{statusLabelMap[task.status]}</span>
                                <span className="text-slate-500">Due {toDeadline(task.deadline)}</span>
                                <span className="text-slate-500">{task.estimated_hours}h estimated</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => submitTask(task.id)}
                              className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-700"
                            >
                              Submit 
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === 'progress' && (
                  <section className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 className="text-2xl font-bold">Performance Trend</h3>
                        <p className="text-sm text-slate-500">Your grades over the past 8 weeks</p>
                        <svg viewBox="0 0 360 170" className="mt-3 w-full">
                          <path d="M30 20 V145 H340" stroke="#94a3b8" strokeWidth="1" fill="none" />
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            points={(dashboard?.charts?.weeklySeries || [72, 76, 74, 80, 79, 84, 82, 86])
                              .map((value, index) => `${30 + index * 44},${145 - value}`)
                              .join(' ')}
                          />
                          {(dashboard?.charts?.weeklySeries || [72, 76, 74, 80, 79, 84, 82, 86]).map((value, index) => (
                            <circle key={`${value}-${index}`} cx={30 + index * 44} cy={145 - value} r="2.5" fill="#2563eb" />
                          ))}
                        </svg>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 className="text-2xl font-bold">Tasks Completed</h3>
                        <p className="text-sm text-slate-500">Number of tasks completed per week</p>
                        <div className="mt-4 grid h-[170px] grid-cols-8 items-end gap-2">
                          {(dashboard?.charts?.completionSeries || [2, 3, 2, 4, 3, 4, 3, 5]).map((item, index) => (
                            <div key={`${item}-${index}`} className="rounded-t bg-emerald-500" style={{ height: `${Math.max(20, item * 24)}px` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-2xl font-bold">Skills Progress</h3>
                      <p className="text-sm text-slate-500">Your developing skills based on completed tasks</p>
                      <div className="mt-4 space-y-3">
                        {(dashboard?.charts?.skills || []).map((skill) => (
                          <div key={skill.name}>
                            <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                              <span>{skill.name}</span>
                              <span>{skill.value}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200">
                              <div className="h-2 rounded-full bg-slate-900" style={{ width: `${skill.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'grades' && (
                  <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-3xl font-bold">Recent Grades</h3>
                    <p className="text-sm text-slate-500">Your graded submissions and feedback</p>
                    <div className="mt-4 rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-bold">Task Submission</h4>
                        <p className="text-4xl font-extrabold">{Math.round(summary.averageGrade)}/100</p>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${Math.max(10, Math.round(summary.averageGrade))}%` }} />
                      </div>
                      <div className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
                        Good work! Your submission meets the requirements. Keep improving code quality and documentation.
                      </div>
                    </div>
                  </section>
                )}

                <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold">All Tasks</h3>
                      <p className="text-sm text-slate-500">Complete list of your assigned tasks</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={prevPage}
                        disabled={pagination.page <= 1}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <span className="text-sm text-slate-500">
                        {pagination.page} / {Math.max(1, pagination.totalPages)}
                      </span>
                      <button
                        type="button"
                        onClick={nextPage}
                        disabled={pagination.page >= pagination.totalPages}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="rounded-xl border border-slate-200 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xl font-bold">{task.title}</p>
                            <p className="text-sm text-slate-500">Due {toDeadline(task.deadline)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={task.status}
                              onChange={(event) => updateTaskStatus(task.id, event.target.value)}
                              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                            >
                              <option value="pending">pending</option>
                              <option value="in_progress">in progress</option>
                              <option value="completed">completed</option>
                            </select>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[task.status]}`}>
                              {statusLabelMap[task.status]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredTasks.length === 0 && <p className="text-sm text-slate-500">No tasks available.</p>}
                  </div>
                </section>

                <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-2xl font-bold">Notifications / Announcements</h3>
                    <p className="text-sm text-slate-500">Latest updates from admin</p>
                    <div className="mt-3 space-y-2">
                      {notifications.map((item) => (
                        <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                          <p className="text-base font-bold">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.message}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && <p className="text-sm text-slate-500">No notifications.</p>}
                    </div>
                  </div>

                  <form onSubmit={updateProfile} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-2xl font-bold">Profile</h3>
                    <p className="text-sm text-slate-500">Name, email, and role information</p>
                    <div className="mt-3 grid gap-3">
                      <input
                        value={profileForm.name}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                        className="rounded-xl border border-slate-200 px-3 py-2"
                        placeholder="Name"
                        required
                      />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                        className="rounded-xl border border-slate-200 px-3 py-2"
                        placeholder="Email"
                        required
                      />
                      <input value="intern" readOnly className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2" />
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="rounded-xl bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
                      >
                        {savingProfile ? 'Saving...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternDashboardPage;
