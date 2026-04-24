import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const CreateTaskModal = ({ onClose, onCreate, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending',
    estimated_hours: 8
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimated_hours' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Task description is required');
      return;
    }

    if (!formData.deadline) {
      toast.error('Deadline is required');
      return;
    }

    // Validate deadline is in future
    if (new Date(formData.deadline) < new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    setIsSubmitting(true);

    try {
      // Note: For interns, they cannot create tasks for themselves
      // This modal would typically be for admins to create tasks
      // The currentUser is passed for reference
      const taskData = {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        status: formData.status,
        estimated_hours: formData.estimated_hours
      };

      await onCreate(taskData);

      // Reset form
      setFormData({
        title: '',
        description: '',
        deadline: '',
        status: 'pending',
        estimated_hours: 8
      });
      onClose();
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      status: 'pending',
      estimated_hours: 8
    });
    onClose();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Build a Portfolio Website"
                maxLength={255}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
              />
              <p className="text-xs text-slate-500 mt-1">{formData.title.length}/255</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the task requirements and expectations..."
                rows="4"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">{formData.description.length} characters</p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={minDate}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
              />
              <p className="text-xs text-slate-500 mt-1">Must be in the future</p>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Hours *</label>
              <input
                type="number"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleChange}
                min="1"
                max="1000"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
              />
              <p className="text-xs text-slate-500 mt-1">Expected time to complete (1-1000 hours)</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default CreateTaskModal;
