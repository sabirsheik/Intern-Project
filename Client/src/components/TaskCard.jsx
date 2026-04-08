import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const priorityStyles = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-red-100 text-red-700',
  medium: 'bg-slate-900 text-white',
  low: 'bg-slate-100 text-slate-700'
};

const TaskCard = ({ task, onDelete, onEdit, onView, index }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition group"
    >
      {/* Card Header with Priority and Menu */}
      <div className="p-6 pb-4 flex items-start justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>

        {/* Three-Dot Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100"
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
                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
              >
                <button
                  onClick={() => {
                    onView(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 w-full text-left transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button
                  onClick={() => {
                    onEdit(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 w-full text-left border-t border-slate-200 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left border-t border-slate-200 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 pb-4">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{task.description}</p>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-cyan-700 bg-cyan-100">
            • {task.category}
          </span>
        </div>
      </div>

      {/* Card Footer - Stats */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-1 text-slate-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>{task.date}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{task.duration}</span>
          </div>
        </div>
      </div>

      {/* Card Footer - Assignment Info */}
      <div className="px-6 py-3 flex items-center justify-between border-t border-slate-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M9 12a9 9 0 1118 0 9 9 0 01-18 0z" fillOpacity="0" />
          </svg>
          <span className="text-sm text-slate-600">{task.assigned} assigned</span>
        </div>
        <span className="text-sm font-bold text-slate-900">{task.points} pts</span>
      </div>
    </motion.div>
  );
};

export default TaskCard;
