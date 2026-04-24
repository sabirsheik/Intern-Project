import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import { LoadingSpinner, SkeletonLoader } from '../components/LoadingSpinner';
import { taskAPI } from '../api/apiService';
import { formatApiError } from '../utils/apiHelpers';

const TaskManagementPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [deleting, setDeleting] = useState(null);

  /**
   * Fetch tasks from API
   */
  const fetchTasks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const status = filterStatus !== 'All Statuses' ? filterStatus.toLowerCase() : null;
      const response = await taskAPI.getAllTasks(page, 10, status);
      
      if (response?.success) {
        setTasks(response.data?.data || []);
        setPagination(response.data?.pagination || {});
      } else {
        setError(response?.message || 'Failed to fetch tasks');
        toast.error(response?.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      const errorMsg = formatApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  /**
   * Load tasks on mount and when filters change
   */
  useEffect(() => {
    fetchTasks(1);
  }, [filterStatus]);

  /**
   * Handle task deletion
   */
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setDeleting(id);
      const response = await taskAPI.deleteTask(id);
      
      if (response?.success) {
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete task');
      }
    } catch (err) {
      const errorMsg = formatApiError(err);
      toast.error(errorMsg);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Handle task status update
   */
  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      const response = await taskAPI.updateTaskStatus(id, newStatus);
      
      if (response?.success) {
        const updatedTask = response.data;
        setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        toast.success('Task status updated successfully');
      } else {
        toast.error(response?.message || 'Failed to update task status');
      }
    } catch (err) {
      const errorMsg = formatApiError(err);
      toast.error(errorMsg);
    }
  };

  /**
   * Handle create task
   */
  const handleCreateTask = async (newTaskData) => {
    try {
      const response = await taskAPI.createTask(newTaskData);
      
      if (response?.success) {
        setTasks([response.data, ...tasks]);
        toast.success('Task created successfully');
        setShowCreateModal(false);
        // Refresh to update pagination
        fetchTasks(1);
      } else {
        toast.error(response?.message || 'Failed to create task');
      }
    } catch (err) {
      const errorMsg = formatApiError(err);
      toast.error(errorMsg);
    }
  };

  /**
   * Filter tasks based on search query
   */
  const filteredTasks = tasks.filter(task => 
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="h-10 w-10 rounded-full bg-orange-200" />
              <div>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">Intern</p>
              </div>
              <button 
                type="button" 
                onClick={logout} 
                className="ml-auto text-sm font-bold text-slate-500 hover:text-slate-800"
              >
                Logout
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
                <button 
                  type="button" 
                  onClick={() => fetchTasks(1)}
                  className="text-lg hover:opacity-70 transition"
                  title="Refresh tasks"
                >
                  🔄
                </button>
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
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition bg-white"
              >
                <option>All Statuses</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
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

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-red-800 font-semibold">Error loading tasks</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => fetchTasks(1)}
                  className="text-red-600 hover:text-red-800 font-semibold whitespace-nowrap"
                >
                  Retry
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading ? (
              <SkeletonLoader count={6} />
            ) : filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-12 text-center"
              >
                <p className="text-slate-500 text-lg">No tasks found. Try adjusting your search or filters.</p>
              </motion.div>
            ) : (
              <>
                {/* Tasks Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleUpdateTaskStatus}
                      isDeleting={deleting === task.id}
                      index={index}
                    />
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex items-center justify-center gap-4"
                  >
                    <button
                      onClick={() => fetchTasks(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <span className="text-slate-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => fetchTasks(Math.min(pagination.totalPages, pagination.page + 1))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </>
            )}

            {/* Create Task Modal */}
            {showCreateModal && (
              <CreateTaskModal
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateTask}
                currentUser={user}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskManagementPage;
