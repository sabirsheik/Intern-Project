import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Eye, Check } from 'lucide-react';

const statusStyles = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' }
};

const TaskCard = ({ task, onDelete, onStatusChange, isDeleting = false, index = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusInfo = statusStyles[task.status] || statusStyles.pending;

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await onStatusChange(task.id, newStatus);
    } finally {
      setUpdatingStatus(false);
      setShowMenu(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition group"
      style={{ opacity: isDeleting ? 0.5 : 1 }}
    >
      {/* Card Header with Status and Menu */}
      <div className="p-6 pb-4 flex items-start justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </span>

        {/* Three-Dot Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
              >
                {/* Status Change Options */}
                <div className="border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 px-4 py-2 uppercase">Change Status</p>
                  {Object.entries(statusStyles).map(([status, { label }]) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={updatingStatus || task.status === status}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {task.status === status && <Check className="w-4 h-4 text-green-600" />}
                      {label}
                    </button>
                  ))}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 pb-4">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-cyan-600 transition">
          {task.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {task.description || 'No description provided'}
        </p>
      </div>

      {/* Card Footer - Stats */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          {task.deadline && (
            <div className="flex items-center gap-1 text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(task.deadline)}</span>
            </div>
          )}

          {task.estimated_hours && (
            <div className="flex items-center gap-1 text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{task.estimated_hours}h</span>
            </div>
          )}
        </div>
      </div>

      {/* Submission Info */}
      {task.submitted_at && (
        <div className="px-6 py-3 border-t border-slate-200 bg-green-50">
          <p className="text-xs text-green-700 font-semibold">
            Submitted: {formatDate(task.submitted_at)}
          </p>
        </div>
      )}

      {/* Delete Loading State */}
      {isDeleting && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-xl">
          <div className="bg-white rounded-lg px-4 py-2">
            <p className="text-sm font-semibold text-slate-700">Deleting...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
