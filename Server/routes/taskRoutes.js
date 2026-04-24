const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getInternTasks
} = require('../controllers/taskController');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * GET /api/tasks - Get all tasks
 * Interns see only their tasks
 * Admins see all tasks
 */
router.get('/', getTasks);

/**
 * GET /api/tasks/:id - Get single task by ID
 * Interns can view their own tasks
 * Admins can view any task
 */
router.get('/:id', getTaskById);

/**
 * POST /api/tasks - Create new task
 * Only admins and superadmins
 */
router.post('/', authorize('admin', 'superadmin'), createTask);

/**
 * PUT /api/tasks/:id - Update task
 * Only admins and superadmins
 */
router.put('/:id', authorize('admin', 'superadmin'), updateTask);

/**
 * PATCH /api/tasks/:id/status - Update task status
 * Interns can update their own task status
 * Admins can update any task status
 */
router.patch('/:id/status', updateTaskStatus);

/**
 * DELETE /api/tasks/:id - Delete task
 * Only admins and superadmins
 */
router.delete('/:id', authorize('admin', 'superadmin'), deleteTask);

/**
 * GET /api/tasks/intern/:internId - Get all tasks for specific intern
 * Only admins and superadmins
 */
router.get('/intern/:internId', authorize('admin', 'superadmin'), getInternTasks);

module.exports = router;
