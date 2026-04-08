import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';

const TaskManagementPage = () => {
  const { user, logout } = useAuth();
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
      points: 100
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
      points: 100
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
      points: 100
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
      points: 100
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
      points: 100
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All Priorities');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All Priorities' || task.priority === filterPriority.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
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
      points: 100
    };
    setTasks([...tasks, task]);
    toast.success('Task created successfully');
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
                  item.label === 'Tasks'
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
              <h1 className="text-4xl font-extrabold">Task Management</h1>
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
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition bg-white"
              >
                <option>All Priorities</option>
                <option>high</option>
                <option>urgent</option>
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

            {/* Tasks Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onView={handleViewTask}
                    index={index}
                  />
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

export default TaskManagementPage;
