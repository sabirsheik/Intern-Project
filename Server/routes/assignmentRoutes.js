const express = require('express');
const { assignInternship, getAssignments } = require('../controllers/assignmentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', authorize('superadmin', 'admin'), assignInternship);
router.get('/', authorize('superadmin', 'admin', 'intern'), getAssignments);

module.exports = router;
