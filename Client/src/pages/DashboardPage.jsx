import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axiosClient from '../api/axiosClient';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'intern' });
  const [newInternship, setNewInternship] = useState({ title: '', description: '', domain: '' });
  const [newAssignment, setNewAssignment] = useState({ intern_id: '', internship_id: '', status: 'active' });
  const [reportContent, setReportContent] = useState('');

  const isSuperAdmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin';
  const isIntern = user?.role === 'intern';

  const internOptions = useMemo(() => users.filter((item) => item.role === 'intern'), [users]);

  const loadData = async () => {
    setLoading(true);
    try {
      const requests = [
        axiosClient.get('/internships'),
        axiosClient.get('/assignments'),
        axiosClient.get('/reports')
      ];

      if (!isIntern) {
        requests.unshift(axiosClient.get('/users'));
      }

      const response = await Promise.all(requests);

      if (isIntern) {
        setInternships(response[0].data);
        setAssignments(response[1].data);
        setReports(response[2].data);
      } else {
        setUsers(response[0].data);
        setInternships(response[1].data);
        setAssignments(response[2].data);
        setReports(response[3].data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.post('/users', newUser);
      toast.success('User created successfully');
      setNewUser({ name: '', email: '', password: '', role: 'intern' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'User creation failed');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosClient.delete(`/users/${id}`);
      toast.success('User deleted');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleCreateInternship = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.post('/internships', newInternship);
      toast.success('Internship created');
      setNewInternship({ title: '', description: '', domain: '' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create internship');
    }
  };

  const handleAssignInternship = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.post('/assign', {
        ...newAssignment,
        intern_id: Number(newAssignment.intern_id),
        internship_id: Number(newAssignment.internship_id)
      });
      toast.success('Intern assigned successfully');
      setNewAssignment({ intern_id: '', internship_id: '', status: 'active' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
  };

  const handleSubmitReport = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.post('/reports', { content: reportContent });
      toast.success('Report submitted');
      setReportContent('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Report submission failed');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Enterprise Intern Portal</h1>
            <p className="text-sm text-slate-600">
              Logged in as <span className="font-semibold capitalize">{user?.role}</span> ({user?.email})
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
          >
            Logout
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {!isIntern && <StatCard title="Users" value={users.length} color="#0369a1" />}
          <StatCard title="Internships" value={internships.length} color="#0f766e" />
          <StatCard title="Assignments" value={assignments.length} color="#ea580c" />
          <StatCard title="Reports" value={reports.length} color="#be123c" />
        </section>

        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center font-semibold text-slate-600">Loading dashboard...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {(isSuperAdmin || isAdmin) && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
                <h2 className="mb-4 text-lg font-bold">Create User</h2>
                <form className="grid grid-cols-1 gap-3" onSubmit={handleCreateUser}>
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} required />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} required />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} required />
                  <select className="rounded-xl border border-slate-200 px-3 py-2" value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}>
                    {(isSuperAdmin ? ['admin', 'intern'] : ['intern']).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-xl bg-cyan-600 px-3 py-2 font-semibold text-white">Create User</button>
                </form>
              </motion.section>
            )}

            {(isSuperAdmin || isAdmin) && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
                <h2 className="mb-4 text-lg font-bold">Create Internship</h2>
                <form className="grid grid-cols-1 gap-3" onSubmit={handleCreateInternship}>
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Title" value={newInternship.title} onChange={(e) => setNewInternship((prev) => ({ ...prev, title: e.target.value }))} required />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Domain" value={newInternship.domain} onChange={(e) => setNewInternship((prev) => ({ ...prev, domain: e.target.value }))} required />
                  <textarea className="rounded-xl border border-slate-200 px-3 py-2" rows={3} placeholder="Description" value={newInternship.description} onChange={(e) => setNewInternship((prev) => ({ ...prev, description: e.target.value }))} required />
                  <button className="rounded-xl bg-teal-600 px-3 py-2 font-semibold text-white">Create Internship</button>
                </form>
              </motion.section>
            )}

            {(isSuperAdmin || isAdmin) && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
                <h2 className="mb-4 text-lg font-bold">Assign Internship</h2>
                <form className="grid grid-cols-1 gap-3" onSubmit={handleAssignInternship}>
                  <select className="rounded-xl border border-slate-200 px-3 py-2" value={newAssignment.intern_id} onChange={(e) => setNewAssignment((prev) => ({ ...prev, intern_id: e.target.value }))} required>
                    <option value="">Select intern</option>
                    {internOptions.map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name} ({intern.email})
                      </option>
                    ))}
                  </select>
                  <select className="rounded-xl border border-slate-200 px-3 py-2" value={newAssignment.internship_id} onChange={(e) => setNewAssignment((prev) => ({ ...prev, internship_id: e.target.value }))} required>
                    <option value="">Select internship</option>
                    {internships.map((internshipItem) => {
                      const item = internshipItem.internship || internshipItem;
                      return (
                        <option key={item.id} value={item.id}>
                          {item.title} ({item.domain})
                        </option>
                      );
                    })}
                  </select>
                  <select className="rounded-xl border border-slate-200 px-3 py-2" value={newAssignment.status} onChange={(e) => setNewAssignment((prev) => ({ ...prev, status: e.target.value }))}>
                    <option value="active">active</option>
                    <option value="completed">completed</option>
                  </select>
                  <button className="rounded-xl bg-orange-600 px-3 py-2 font-semibold text-white">Assign Internship</button>
                </form>
              </motion.section>
            )}

            {isIntern && (
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
                <h2 className="mb-4 text-lg font-bold">Submit Weekly Report</h2>
                <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmitReport}>
                  <textarea className="rounded-xl border border-slate-200 px-3 py-2" rows={5} placeholder="Write your progress update..." value={reportContent} onChange={(e) => setReportContent(e.target.value)} required />
                  <button className="rounded-xl bg-rose-600 px-3 py-2 font-semibold text-white">Submit Report</button>
                </form>
              </motion.section>
            )}

            {!isIntern && (
              <section className="glass-card rounded-2xl p-5">
                <h2 className="mb-4 text-lg font-bold">Users</h2>
                <div className="soft-scroll max-h-72 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 capitalize">{item.role}</td>
                          <td className="py-2">
                            {item.id !== user.id && (
                              <button onClick={() => handleDeleteUser(item.id)} className="rounded-md bg-red-100 px-2 py-1 text-red-700">
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <section className="glass-card rounded-2xl p-5">
              <h2 className="mb-4 text-lg font-bold">Assignments</h2>
              <div className="soft-scroll max-h-72 overflow-auto space-y-2">
                {assignments.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-3">
                    <p className="font-semibold text-slate-800">{item.internship?.title || item.internship?.domain || 'Internship'}</p>
                    <p className="text-sm text-slate-600">Status: {item.status}</p>
                    <p className="text-sm text-slate-500">Intern: {item.intern?.name || user?.name}</p>
                  </div>
                ))}
                {assignments.length === 0 && <p className="text-sm text-slate-500">No assignments available.</p>}
              </div>
            </section>

            <section className="glass-card rounded-2xl p-5 lg:col-span-2">
              <h2 className="mb-4 text-lg font-bold">Reports</h2>
              <div className="soft-scroll max-h-80 overflow-auto space-y-2">
                {reports.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-3">
                    <p className="text-sm text-slate-500">{new Date(item.submitted_at).toLocaleString()}</p>
                    <p className="mt-1 text-sm text-slate-700">{item.content}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">By: {item.intern?.name || user?.name}</p>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-sm text-slate-500">No reports submitted yet.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
