import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const CertificatePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'Web Development Internship',
      category: 'Web Development',
      certificateID: 'IP-2024-001',
      issueDate: '1/15/2024',
      expiryDate: '1/15/2025',
      score: '92%',
      status: 'issued',
      domain: 'Web Development'
    },
    {
      id: 2,
      name: 'React Advanced Certification',
      category: 'Web Development',
      certificateID: 'IP-2024-015',
      issueDate: '2/20/2024',
      expiryDate: null,
      score: '88%',
      status: 'issued',
      domain: 'Web Development'
    }
  ]);

  const [isRequesting, setIsRequesting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Calculate eligibility metrics
  const eligibility = useMemo(() => {
    return {
      taskCompletion: 85,
      averageGrade: 88.5,
      attendance: 92,
      tasksDone: '24/28',
      isEligible: true
    };
  }, []);

  const handleRequestCertificate = async () => {
    setIsRequesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const newCertificate = {
        id: certificates.length + 1,
        name: 'New Web Development Certificate',
        category: 'Web Development',
        certificateID: `IP-2024-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        issueDate: new Date().toLocaleDateString('en-US'),
        expiryDate: null,
        score: `${eligibility.averageGrade}%`,
        status: 'issued',
        domain: 'Web Development'
      };

      setCertificates([...certificates, newCertificate]);
      toast.success('✓ Certificate requested successfully!');
    } catch (error) {
      toast.error('Failed to request certificate: ' + error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDownloadCertificate = async (certificateID) => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate download
      toast.success(`✓ Certificate ${certificateID} downloaded successfully!`);
    } catch (error) {
      toast.error('Failed to download certificate: ' + error.message);
    } finally {
      setIsDownloading(false);
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
                  item.label === 'Certificates'
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
              <h1 className="text-4xl font-extrabold">Certificates</h1>
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
              <h2 className="text-3xl md:text-4xl font-bold">Certificates</h2>
              <p className="text-slate-600 mt-1">Manage your internship certificates and eligibility</p>
            </motion.div>

            {/* Certificate Eligibility Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📜</span>
                <h3 className="text-2xl font-bold">Certificate Eligibility</h3>
              </div>
              <p className="text-slate-600 mb-8">Your progress towards earning an internship certificate</p>

              {/* Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
                {[
                  { label: 'Task Completion', value: eligibility.taskCompletion, max: 100 },
                  { label: 'Average Grade', value: eligibility.averageGrade, max: 100 },
                  { label: 'Attendance', value: eligibility.attendance, max: 100 },
                  { label: 'Tasks Done', value: eligibility.tasksDone, max: '28' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-sm font-semibold text-slate-700 mb-3">{item.label}</p>
                    <div className="relative mb-2">
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: typeof item.value === 'number' 
                              ? `${(item.value / (item.max === '28' ? 28 : item.max)) * 100}%`
                              : '100%'
                          }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-slate-900 to-slate-700 h-full rounded-full"
                        />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{item.value}{typeof item.value === 'number' ? '%' : ''}</p>
                  </motion.div>
                ))}
              </div>

              {/* Eligibility Alert */}
              {eligibility.isEligible && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">✓</span>
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900 text-lg">Congratulations! You're eligible for a certificate</p>
                      <p className="text-sm text-emerald-700 mt-1">You've met all the requirements for the Web Development internship certificate</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRequestCertificate}
                    disabled={isRequesting}
                    className="flex-shrink-0 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isRequesting ? '⏳ Requesting...' : '📜 Request Certificate'}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* My Certificates Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📋</span>
                My Certificates
              </h3>

              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Certificate Header with Icon */}
                      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="absolute w-32 h-32 bg-slate-200 rounded-full opacity-20"
                        />
                        <span className="text-8xl relative z-10">📜</span>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="absolute top-4 right-4"
                        >
                          <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                            ● Issued
                          </span>
                        </motion.div>
                      </div>

                      {/* Certificate Details */}
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-2">{cert.name}</h4>
                        <p className="text-slate-600 text-sm mb-4">{cert.category}</p>

                        <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Certificate ID</span>
                            <span className="font-semibold text-slate-900">{cert.certificateID}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Issue Date</span>
                            <span className="font-semibold text-slate-900">{cert.issueDate}</span>
                          </div>
                          {cert.expiryDate && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600">Expiry Date</span>
                              <span className="font-semibold text-slate-900">{cert.expiryDate}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Score</span>
                            <span className="font-semibold text-slate-900">{cert.score}</span>
                          </div>
                        </div>

                        {/* Download Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownloadCertificate(cert.certificateID)}
                          disabled={isDownloading}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>⬇</span>
                          {isDownloading ? 'Downloading...' : 'Download Certificate'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-12 text-center"
                >
                  <p className="text-slate-500 text-lg">No certificates yet. Keep working towards your eligibility!</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CertificatePage;
