import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';

const AdminTasksPage = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Build a Responsive Portfolio Website',
      description: 'Create a personal portfolio website using HTML, CSS, and JavaScript. The website should be fully responsive and...',
      category: 'Web Development',
      priority: 'high',
      date: '4/22/2026',
      duration: '20h',
      assigned: 4,
      points: 100,
      assignedTo: 'Harper Lewis'
    },
    {
      id: 2,
      title: 'E-commerce Frontend 2',
      description: 'Complete the E-commerce Frontend project according to domain standards and best practices.',
      category: 'Web Development',
      priority: 'high',
      date: '4/15/2026',
      duration: '10h',
      assigned: 4,
      points: 100,
      assignedTo: 'Michael Brown'
    },
    {
      id: 3,
      title: 'REST API Development 4',
      description: 'Complete the REST API Development project according to domain standards and best practices.',
      category: 'Web Development',
      priority: 'urgent',
      date: '4/9/2026',
      duration: '27h',
      assigned: 5,
      points: 100,
      assignedTo: 'Mia Harris'
    },
    {
      id: 4,
      title: 'Authentication System 5',
      description: 'Complete the Authentication System project according to domain standards and best practices.',
      category: 'Web Development',
      priority: 'high',
      date: '4/27/2026',
      duration: '17h',
      assigned: 5,
      points: 100,
      assignedTo: 'Oliver Rodriguez'
    },
    {
      id: 5,
      title: 'Dashboard Analytics 6',
      description: 'Complete the Dashboard Analytics project according to domain standards and best practices.',
      category: 'Web Development',
      priority: 'medium',
      date: '4/24/2026',
      duration: '17h',
      assigned: 5,
      points: 100,
      assignedTo: 'Noah Brown'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All Priorities');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All Priorities' || task.priority === filterPriority.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('✓ Task deleted successfully');
    }
  };

  const handleEditTask = (id) => {
    toast.info('Edit task - Coming soon');
  };

  const handleViewTask = (id) => {
    toast.info('View task details - Coming soon');
  };

  const handleCreateTask = (newTask) => {
    const task = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      ...newTask,
      assigned: Math.floor(Math.random() * 5) + 1,
      points: 100,
      assignedTo: 'Pending Assignment'
    };
    setTasks([...tasks, task]);
    toast.success('✓ Task created successfully');
    setShowCreateModal(false);
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
                  item.label === 'Tasks'
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
              <h1 className="text-4xl font-extrabold">Task Management</h1>
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
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">All Domain Tasks</h2>
              <p className="text-slate-600">Manage and track all tasks assigned to interns in Web Development</p>
            </motion.div>

            {/* Search & Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-3 text-slate-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks or assigned interns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition bg-white"
              >
                <option>All Priorities</option>
                <option>urgent</option>
                <option>high</option>
                <option>medium</option>
                <option>low</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
              >
                <span className="text-xl">+</span>
                Create Task
              </motion.button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-slate-600 text-sm font-semibold">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{tasks.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-slate-600 text-sm font-semibold">Urgent</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{tasks.filter(t => t.priority === 'urgent').length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-slate-600 text-sm font-semibold">High Priority</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{tasks.filter(t => t.priority === 'high').length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-slate-600 text-sm font-semibold">Filtered Results</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{filteredTasks.length}</p>
              </div>
            </motion.div>

            {/* Tasks Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition group"
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4 flex items-start justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        task.priority === 'medium' ? 'bg-slate-900 text-white' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Three-Dot Menu */}
                      <div className="relative group/menu">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </motion.button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition duration-200">
                          <button
                            onClick={() => handleViewTask(task.id)}
                            className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 w-full text-left transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 w-full text-left border-t border-slate-200 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left border-t border-slate-200 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-6 pb-4">
                      <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">{task.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{task.description}</p>

                      {/* Assigned To Badge */}
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold mb-1">ASSIGNED TO</p>
                        <p className="text-sm font-bold text-slate-900">{task.assignedTo}</p>
                      </div>

                      {/* Category Badge */}
                      <div className="inline-block px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs font-semibold mb-4">
                        {task.category}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                      <span>📅 {task.date}</span>
                      <span>⏱️ {task.duration}</span>
                      <span className="font-bold text-slate-900">⭐ {task.points}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-12 text-center"
                >
                  <p className="text-slate-500 text-lg">No tasks found. Try adjusting your search or filters.</p>
                </motion.div>
              )}
            </motion.div>

            {/* Create Task Modal */}
            {showCreateModal && (
              <CreateTaskModal
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateTask}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTasksPage;
