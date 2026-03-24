const express = require('express');
const {
  getInternDashboard,
  getInternTasks,
  updateTaskStatus,
  submitTask,
  getInternNotifications,
  updateInternProfile
} = require('../controllers/internController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('intern'));

router.get('/dashboard', getInternDashboard);
router.get('/tasks', getInternTasks);
router.patch('/tasks/:id/status', updateTaskStatus);
router.post('/tasks/:id/submit', submitTask);
router.get('/notifications', getInternNotifications);
router.patch('/profile', updateInternProfile);

module.exports = router;
