import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const AttendancePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Attendance records with realistic data
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      date: '2026-01-15',
      day: 'Monday, Jan 15',
      checkIn: '09:00',
      checkOut: '17:30',
      status: 'present',
      totalHours: 8.5,
      location: 'Office'
    },
    {
      id: 2,
      date: '2026-01-16',
      day: 'Tuesday, Jan 16',
      checkIn: '08:45',
      checkOut: '17:15',
      status: 'present',
      totalHours: 8.25,
      location: 'Office'
    },
    {
      id: 3,
      date: '2026-01-17',
      day: 'Wednesday, Jan 17',
      checkIn: '09:30',
      checkOut: '17:30',
      status: 'late',
      totalHours: 8.0,
      location: 'Office'
    },
    {
      id: 4,
      date: '2026-01-18',
      day: 'Thursday, Jan 18',
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'present',
      totalHours: 9.0,
      location: 'Office'
    },
    {
      id: 5,
      date: '2026-01-19',
      day: 'Friday, Jan 19',
      checkIn: null,
      checkOut: null,
      status: 'absent',
      totalHours: 0,
      location: '-'
    }
  ]);

  const [currentDate] = useState(new Date(2026, 3, 9)); // April 9, 2026
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Get current month calendar
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const hasAttendance = attendanceRecords.some(
        record => new Date(record.date).toDateString() === dateObj.toDateString()
      );
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: dateObj,
        hasAttendance,
        status: attendanceRecords.find(
          record => new Date(record.date).toDateString() === dateObj.toDateString()
        )?.status
      });
    }

    // Next month's days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }

    return days;
  }, [selectedDate, attendanceRecords]);

  // Get selected date details
  const selectedDateRecord = useMemo(() => {
    return attendanceRecords.find(
      record => new Date(record.date).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate, attendanceRecords]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = 24; // Working days in the month
    const presentDays = attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
    const totalHours = attendanceRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const avgHours = attendanceRecords.length > 0 ? (totalHours / attendanceRecords.length).toFixed(1) : 0;
    const attendanceRate = ((presentDays / totalDays) * 100).toFixed(1);

    return { attendanceRate, presentDays, absentDays, avgHours, totalDays };
  }, [attendanceRecords]);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const now = new Date();
      const checkInTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });

      // Check if record exists for today
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const existingRecord = attendanceRecords.find(r => r.date === todayString);

      if (existingRecord && existingRecord.checkIn) {
        toast.error('You have already checked in today');
        return;
      }

      const newRecord = {
        id: Math.max(...attendanceRecords.map(r => r.id), 0) + 1,
        date: todayString,
        day: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
        checkIn: checkInTime,
        checkOut: null,
        status: 'present',
        totalHours: 0,
        location: 'Office'
      };

      if (existingRecord) {
        existingRecord.checkIn = checkInTime;
        existingRecord.status = 'present';
      } else {
        setAttendanceRecords([...attendanceRecords, newRecord]);
      }

      setHasCheckedInToday(true);
      toast.success('✓ Checked in successfully at ' + checkInTime);
    } catch (error) {
      toast.error('Failed to check in: ' + error.message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingIn(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const now = new Date();
      const checkOutTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });

      const todayString = new Date().toISOString().split('T')[0];
      const today = attendanceRecords.find(r => r.date === todayString);

      if (!today || !today.checkIn) {
        toast.error('Please check in first');
        return;
      }

      if (today.checkOut) {
        toast.error('You have already checked out today');
        return;
      }

      const [checkInHour, checkInMin] = today.checkIn.split(':').map(Number);
      const [checkOutHour, checkOutMin] = checkOutTime.split(':').map(Number);
      const totalHours = ((checkOutHour + checkOutMin / 60) - (checkInHour + checkInMin / 60)).toFixed(2);

      today.checkOut = checkOutTime;
      today.totalHours = parseFloat(totalHours);

      setAttendanceRecords([...attendanceRecords]);
      toast.success('✓ Checked out successfully at ' + checkOutTime);
    } catch (error) {
      toast.error('Failed to check out: ' + error.message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-700';
      case 'late':
        return 'bg-amber-100 text-amber-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return '●';
      case 'late':
        return '◉';
      case 'absent':
        return '◯';
      default:
        return '◌';
    }
  };

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
                  item.label === 'Attendance'
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
              <h1 className="text-4xl font-extrabold">Attendance Tracking</h1>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Attendance Tracking</h2>
                  <p className="text-slate-600 mt-1">Monitor and manage attendance records</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>●</span>
                  {isCheckingIn ? 'Processing...' : 'Check In'}
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8"
            >
              {[
                { label: 'Attendance Rate', value: stats.attendanceRate + '%', icon: '📊' },
                { label: 'Present Days', value: stats.presentDays, description: `Out of ${stats.totalDays} working days`, icon: '✓' },
                { label: 'Absent Days', value: stats.absentDays, description: `${(stats.absentDays / stats.totalDays * 100).toFixed(0)}% of total`, icon: '✕' },
                { label: 'Avg Hours/Day', value: `${stats.avgHours}h`, description: 'Based on check-in/out times', icon: '🕐' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold text-slate-700">{stat.label}</p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-900">{stat.value}</p>
                  {stat.description && <p className="text-sm text-slate-500 mt-1">{stat.description}</p>}
                </motion.div>
              ))}
            </motion.div>

            {/* Calendar/List Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-xl bg-slate-200 p-1 mb-8"
            >
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  viewMode === 'calendar'
                    ? 'bg-white text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 Calendar View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📋 List View
              </button>
            </motion.div>

            {/* Calendar or List View */}
            {viewMode === 'calendar' ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Calendar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-1"
                >
                  <h3 className="text-2xl font-bold mb-4">Attendance Calendar</h3>
                  <p className="text-sm text-slate-500 mb-6">Select a date to view attendance details</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                        className="text-lg hover:text-slate-900"
                      >
                        ◀
                      </button>
                      <p className="font-semibold">{monthName}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                        className="text-lg hover:text-slate-900"
                      >
                        ▶
                      </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {dayNames.map(day => (
                        <p key={day} className="text-center text-sm font-semibold text-slate-500 py-2">
                          {day}
                        </p>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, index) => {
                        const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();
                        const isToday = day.fullDate.toDateString() === new Date().toDateString();

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedDate(day.fullDate)}
                            className={`py-2 rounded-lg text-sm font-semibold transition ${
                              isSelected
                                ? 'bg-slate-900 text-white'
                                : isToday
                                ? 'bg-slate-200 text-slate-900'
                                : !day.isCurrentMonth
                                ? 'text-slate-300'
                                : 'hover:bg-slate-100 text-slate-700'
                            } ${day.status === 'present' ? 'ring-2 ring-emerald-500' : ''} ${
                              day.status === 'absent' ? 'ring-2 ring-red-500' : ''
                            }`}
                          >
                            {day.date}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Day Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2"
                >
                  <h3 className="text-2xl font-bold mb-4">Day Details</h3>
                  <p className="text-slate-500 mb-6">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>

                  {selectedDateRecord ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Status</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedDateRecord.status)}`}>
                            {getStatusIcon(selectedDateRecord.status)} {selectedDateRecord.status.charAt(0).toUpperCase() + selectedDateRecord.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Check In</p>
                          <p className="text-2xl font-bold">{selectedDateRecord.checkIn || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Check Out</p>
                          <p className="text-2xl font-bold">{selectedDateRecord.checkOut || '-'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500 mb-2">Total Hours</p>
                        <p className="text-2xl font-bold">{selectedDateRecord.totalHours ? selectedDateRecord.totalHours + 'h' : '-'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-500 mb-2">Location</p>
                        <p className="text-lg font-semibold">📍 {selectedDateRecord.location}</p>
                      </div>

                      {selectedDateRecord.checkIn && !selectedDateRecord.checkOut && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCheckOut}
                          disabled={isCheckingIn}
                          className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCheckingIn ? 'Processing...' : '⊙ Check Out'}
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-12">No attendance record for this date</p>
                  )}
                </motion.div>
              </div>
            ) : (
              /* List View */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-2xl font-bold mb-6">Attendance History</h3>
                <p className="text-sm text-slate-500 mb-6">Complete attendance record</p>

                <div className="space-y-3">
                  {attendanceRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{record.day}</p>
                          <p className="text-sm text-slate-500">
                            {record.checkIn ? `${record.checkIn} - ${record.checkOut || 'In progress'}` : 'No check-in'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Hours</p>
                            <p className="font-bold text-slate-900">{record.totalHours ? record.totalHours + 'h' : '-'}</p>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)} {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
