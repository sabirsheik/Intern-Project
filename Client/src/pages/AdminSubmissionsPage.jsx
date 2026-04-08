import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const AdminSubmissionsPage = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      intern: { name: 'Noah Brown', email: 'noah.brown22@email.com', avatar: '👨' },
      task: 'Authentication System 5',
      description: 'Complete the Authentication System project according to domain standards and best practices.',
      submitted: '4/6/2026',
      duration: '4h',
      status: 'pending',
      grade: null
    },
    {
      id: 2,
      intern: { name: 'Liam Taylor', email: 'liam.taylor43@email.com', avatar: '👨' },
      task: 'Build a Responsive Portfolio Website',
      description: 'Create a personal portfolio website using HTML, CSS, and JavaScript. The website should be fully responsive...',
      submitted: 'N/A',
      duration: '7h',
      status: 'pending',
      grade: null
    },
    {
      id: 3,
      intern: { name: 'Oliver Rodriguez', email: 'oliver.rodriguez15@email.com', avatar: '👨' },
      task: 'REST API Development 4',
      description: 'Complete the REST API Development project according to domain standards and best practices.',
      submitted: 'N/A',
      duration: '8h',
      status: 'pending',
      grade: null
    },
    {
      id: 4,
      intern: { name: 'Isabella Thompson', email: 'isabella.thompson50@email.com', avatar: '👩' },
      task: 'REST API Development 4',
      description: 'Complete the REST API Development project according to domain standards and best practices.',
      submitted: 'N/A',
      duration: '6h',
      status: 'in_progress',
      grade: null
    },
    {
      id: 5,
      intern: { name: 'Liam Taylor', email: 'liam.taylor43@email.com', avatar: '👨' },
      task: 'Authentication System 5',
      description: 'Complete the Authentication System project according to domain standards and best practices.',
      submitted: 'N/A',
      duration: '8h',
      status: 'in_progress',
      grade: null
    },
    {
      id: 6,
      intern: { name: 'Noah Brown', email: 'noah.brown22@email.com', avatar: '👨' },
      task: 'Dashboard Analytics 6',
      description: 'Complete the Dashboard Analytics project according to domain standards and best practices.',
      submitted: 'N/A',
      duration: '8h',
      status: 'in_progress',
      grade: null
    },
    {
      id: 7,
      intern: { name: 'Harper Lewis', email: 'harper.lewis36@email.com', avatar: '👨' },
      task: 'REST API Development 4',
      description: 'Complete the REST API Development project according to domain standards and best practices.',
      submitted: '4/6/2026',
      duration: '10h',
      status: 'completed',
      grade: 78
    }
  ]);

  const [activeTab, setActiveTab] = useState('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState('');

  // Filter by tab and search
  const tabStatusMap = {
    pending_review: 'pending',
    in_progress: 'in_progress',
    completed: 'completed'
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesTab = sub.status === tabStatusMap[activeTab];
    const matchesSearch = 
      sub.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.intern.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Count submissions by status
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const inProgressCount = submissions.filter(s => s.status === 'in_progress').length;
  const completedCount = submissions.filter(s => s.status === 'completed').length;

  const handleGradeClick = (submission) => {
    setSelectedSubmission(submission);
    setGradeValue(submission.grade || '');
    setGradeModalOpen(true);
  };

  const handleSubmitGrade = () => {
    if (!gradeValue || gradeValue < 0 || gradeValue > 100) {
      toast.error('Please enter a valid grade (0-100)');
      return;
    }

    setSubmissions(submissions.map(sub =>
      sub.id === selectedSubmission.id
        ? { ...sub, grade: parseInt(gradeValue), status: 'completed' }
        : sub
    ));

    toast.success(`✓ Graded: ${selectedSubmission.task} - ${gradeValue}/100`);
    setGradeModalOpen(false);
    setSelectedSubmission(null);
    setGradeValue('');
  };

  const handleStatusChange = (submissionId, newStatus) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    ));
    toast.success('✓ Status updated');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-white', text: 'text-slate-600', border: 'border-slate-200', icon: '⭕' };
      case 'in_progress':
        return { bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-900', icon: '⏳' };
      case 'completed':
        return { bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-900', icon: '✓' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: '•' };
    }
  };

  const StatusBadgeComponent = ({ status }) => {
    const badge = getStatusBadge(status);
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
        {badge.icon} {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
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
                  item.label === 'Submissions'
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
              <h1 className="text-4xl font-extrabold">Submissions & Grading</h1>
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
              <h2 className="text-3xl font-bold">Submissions & Grading</h2>
              <p className="text-slate-600 mt-1">Review and grade intern submissions</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="relative">
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
                  placeholder="Search by task or intern name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
                />
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4 mb-8 border-b border-slate-200"
            >
              {[
                { id: 'pending_review', label: 'Pending Review', count: pendingCount },
                { id: 'in_progress', label: 'In Progress', count: inProgressCount },
                { id: 'completed', label: 'Completed', count: completedCount }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 font-semibold text-sm transition relative ${
                    activeTab === tab.id
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && tab.id === 'pending_review' && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full">
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900"
                    />
                  )}
                </button>
              ))}
            </motion.div>

            {/* Submissions Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="wait">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission, idx) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition"
                    >
                      {/* Card Header */}
                      <div className="p-4 border-b border-slate-200 flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-3xl">{submission.intern.avatar}</div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-900">{submission.intern.name}</p>
                            <p className="text-xs text-slate-500">{submission.intern.email}</p>
                          </div>
                        </div>
                        <StatusBadgeComponent status={submission.status} />
                      </div>

                      {/* Card Body */}
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 mb-2">{submission.task}</h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-3">{submission.description}</p>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                          <span>📅 Submitted {submission.submitted}</span>
                          <span>⏱️ {submission.duration}</span>
                        </div>

                        {/* Grade Display for Completed */}
                        {submission.status === 'completed' && submission.grade !== null && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-yellow-700">⭐ Grade</p>
                              <p className="text-sm font-bold text-slate-900">{submission.grade}/100</p>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${submission.grade}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer - Actions */}
                      <div className="p-4 border-t border-slate-200 flex gap-2">
                        {submission.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleGradeClick(submission)}
                            className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                          >
                            ⭐ Grade Submission
                          </motion.button>
                        )}
                        {submission.status === 'in_progress' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleStatusChange(submission.id, 'pending')}
                              className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300 transition"
                            >
                              Mark Pending
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleGradeClick(submission)}
                              className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                            >
                              ⭐ Grade
                            </motion.button>
                          </>
                        )}
                        {submission.status === 'completed' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleGradeClick(submission)}
                            className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300 transition"
                          >
                            Edit Grade
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-12 text-center"
                  >
                    <p className="text-slate-500 text-lg">No submissions found in this category.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Grade Modal */}
      <AnimatePresence>
        {gradeModalOpen && selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setGradeModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="border-b border-slate-200 p-6">
                <h3 className="text-2xl font-bold">Grade Submission</h3>
                <p className="text-slate-600 text-sm mt-1">{selectedSubmission.task}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Student</p>
                  <p className="font-bold text-slate-900">{selectedSubmission.intern.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Grade (0-100)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      placeholder="Enter grade..."
                    />
                    <span className="text-slate-600">/100</span>
                  </div>
                </div>

                {gradeValue && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                  >
                    <p className="text-sm text-blue-600">
                      Preview: <span className="font-bold">{gradeValue}%</span> grade
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${gradeValue}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 p-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGradeModalOpen(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitGrade}
                  className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
                >
                  Submit Grade
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSubmissionsPage;
