const { Op } = require('sequelize');
const { fn, col, where: sequelizeWhere } = require('sequelize');
const { User, Task, Notification } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const formatTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  deadline: task.deadline,
  status: task.status,
  estimated_hours: task.estimated_hours,
  submitted_at: task.submitted_at,
  created_at: task.createdAt
});

const getInternDashboard = asyncHandler(async (req, res) => {
  const internId = req.user.id;

  const tasks = await Task.findAll({
    where: { intern_id: internId },
    order: [['deadline', 'ASC']]
  });

  const notificationsCount = await Notification.count({
    where: {
      [Op.or]: [{ intern_id: internId }, { intern_id: null }],
      is_read: false
    }
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;

  const averageGrade = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 1000) / 10;

  const weeklySeries = [
    Math.max(55, averageGrade - 4),
    Math.max(58, averageGrade - 2),
    Math.max(57, averageGrade - 6),
    Math.max(60, averageGrade - 1),
    Math.max(61, averageGrade - 3),
    Math.max(62, averageGrade + 1),
    Math.max(63, averageGrade - 1),
    Math.max(64, averageGrade + 2)
  ].map((value) => Math.min(98, value));

  const completionSeries = [2, 3, 2, 4, 3, 4, 3, Math.max(1, completedTasks || 1)];

  const skills = [
    { name: 'Technical Knowledge', value: Math.min(98, Math.max(60, Math.round(averageGrade + 9))) },
    { name: 'Problem Solving', value: Math.min(98, Math.max(55, Math.round(averageGrade + 2))) },
    { name: 'Communication', value: Math.min(98, Math.max(52, Math.round(averageGrade - 4))) },
    { name: 'Time Management', value: Math.min(98, Math.max(57, Math.round(averageGrade + 1))) },
    { name: 'Code Quality', value: Math.min(98, Math.max(58, Math.round(averageGrade + 12))) }
  ];

  sendSuccess(res, {
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    },
    summary: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      averageGrade,
      notificationsCount
    },
    highlights: {
      subtitle: 'Web Development Intern • Keep up the great work!',
      trendChange: '+2.5% from last month'
    },
    charts: {
      weeklySeries,
      completionSeries,
      skills
    },
    upcomingTasks: tasks.slice(0, 3).map(formatTask)
  }, 'Dashboard data retrieved successfully', 200);
});

const getInternTasks = asyncHandler(async (req, res) => {
  const internId = req.user.id;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 6));
  const offset = (page - 1) * limit;

  const whereClause = { intern_id: internId };
  const status = req.query.status;
  if (status && ['pending', 'in_progress', 'completed'].includes(status)) {
    whereClause.status = status;
  }

  const { rows, count } = await Task.findAndCountAll({
    where: whereClause,
    order: [['deadline', 'ASC']],
    limit,
    offset
  });

  sendSuccess(res, {
    data: rows.map(formatTask),
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  }, 'Tasks retrieved successfully', 200);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const task = await Task.findOne({ where: { id, intern_id: req.user.id } });

  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  task.status = status;
  if (status === 'completed' && !task.submitted_at) {
    task.submitted_at = new Date();
  }

  await task.save();

  sendSuccess(res, formatTask(task), 'Task status updated successfully', 200);
});

const submitTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({ where: { id, intern_id: req.user.id } });

  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  task.status = 'completed';
  task.submitted_at = new Date();
  await task.save();

  sendSuccess(res, formatTask(task), 'Task submitted successfully', 200);
});

const getInternNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: {
      [Op.or]: [{ intern_id: req.user.id }, { intern_id: null }]
    },
    order: [['createdAt', 'DESC']],
    limit: 20
  });

  sendSuccess(res, notifications, 'Notifications retrieved successfully', 200);
});

const updateInternProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return sendError(res, 'Name and email are required', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({
    where: sequelizeWhere(fn('lower', col('email')), normalizedEmail)
  });
  if (existing && existing.id !== req.user.id) {
    return sendError(res, 'Email is already in use', 409);
  }

  const user = await User.findByPk(req.user.id);
  user.name = name;
  user.email = normalizedEmail;
  await user.save();

  sendSuccess(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }, 'Profile updated successfully', 200);
});

module.exports = {
  getInternDashboard,
  getInternTasks,
  updateTaskStatus,
  submitTask,
  getInternNotifications,
  updateInternProfile
};
