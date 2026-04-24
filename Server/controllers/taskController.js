const { Task, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Reusable task formatter
 */
const formatTask = (task) => ({
  id: task.id,
  intern_id: task.intern_id,
  title: task.title,
  description: task.description,
  deadline: task.deadline,
  status: task.status,
  estimated_hours: task.estimated_hours,
  submitted_at: task.submitted_at,
  created_at: task.createdAt,
  updated_at: task.updatedAt
});

/**
 * GET /api/tasks - Get all tasks (filtered by role)
 * Interns see only their tasks
 * Admins see all tasks
 */
const getTasks = asyncHandler(async (req, res) => {
  let whereClause = {};

  // Interns can only see their own tasks
  if (req.user.role === 'intern') {
    whereClause.intern_id = req.user.id;
  }

  // Query params for filtering and pagination
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  // Optional status filter
  if (req.query.status && ['pending', 'in_progress', 'completed'].includes(req.query.status)) {
    whereClause.status = req.query.status;
  }

  // Optional intern_id filter (for admins only)
  if (req.user.role !== 'intern' && req.query.intern_id) {
    whereClause.intern_id = req.query.intern_id;
  }

  const { rows, count } = await Task.findAndCountAll({
    where: whereClause,
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }],
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

/**
 * GET /api/tasks/:id - Get single task
 */
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByPk(id, {
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }]
  });

  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  // Interns can only view their own tasks
  if (req.user.role === 'intern' && task.intern_id !== req.user.id) {
    return sendError(res, 'Unauthorized to view this task', 403);
  }

  sendSuccess(res, formatTask(task), 'Task retrieved successfully', 200);
});

/**
 * POST /api/tasks - Create new task
 * Only admins can create tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const { intern_id, title, description, deadline, status = 'pending', estimated_hours = 8 } = req.body;

  // Validation
  if (!intern_id || !title || !description || !deadline) {
    return sendError(res, 'intern_id, title, description, and deadline are required', 400);
  }

  // Check if intern exists
  const intern = await User.findByPk(intern_id);
  if (!intern || intern.role !== 'intern') {
    return sendError(res, 'Intern user not found', 404);
  }

  // Validate status
  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  // Validate deadline is in future
  if (new Date(deadline) < new Date()) {
    return sendError(res, 'Deadline must be in the future', 400);
  }

  const task = await Task.create({
    intern_id,
    title,
    description,
    deadline,
    status,
    estimated_hours
  });

  // Fetch with relationship
  const createdTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }]
  });

  sendSuccess(res, formatTask(createdTask), 'Task created successfully', 201);
});

/**
 * PUT /api/tasks/:id - Update task
 * Only admins can update tasks
 */
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, status, estimated_hours } = req.body;

  const task = await Task.findByPk(id);
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  // Update fields if provided
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (deadline !== undefined) task.deadline = deadline;
  if (estimated_hours !== undefined) task.estimated_hours = estimated_hours;

  // Handle status update with submitted_at tracking
  if (status !== undefined) {
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }
    task.status = status;
    if (status === 'completed' && !task.submitted_at) {
      task.submitted_at = new Date();
    }
  }

  await task.save();

  // Fetch with relationship
  const updatedTask = await Task.findByPk(id, {
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }]
  });

  sendSuccess(res, formatTask(updatedTask), 'Task updated successfully', 200);
});

/**
 * PATCH /api/tasks/:id/status - Update task status  
 * Interns can update their own task status
 * Admins can update any task status
 */
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return sendError(res, 'Status is required', 400);
  }

  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }

  const task = await Task.findByPk(id);
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  // Interns can only update their own tasks
  if (req.user.role === 'intern' && task.intern_id !== req.user.id) {
    return sendError(res, 'Unauthorized to update this task', 403);
  }

  task.status = status;
  if (status === 'completed' && !task.submitted_at) {
    task.submitted_at = new Date();
  }

  await task.save();

  // Fetch with relationship
  const updatedTask = await Task.findByPk(id, {
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }]
  });

  sendSuccess(res, formatTask(updatedTask), 'Task status updated successfully', 200);
});

/**
 * DELETE /api/tasks/:id - Delete task
 * Only admins can delete tasks
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByPk(id);
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  await task.destroy();

  sendSuccess(res, null, 'Task deleted successfully', 200);
});

/**
 * GET /api/tasks/intern/:internId - Get all tasks for a specific intern
 * Only available to admins
 */
const getInternTasks = asyncHandler(async (req, res) => {
  const { internId } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const { rows, count } = await Task.findAndCountAll({
    where: { intern_id: internId },
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }],
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
  }, 'Intern tasks retrieved successfully', 200);
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getInternTasks
};
