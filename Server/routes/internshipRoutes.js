const express = require('express');
const { createInternship, getInternships } = require('../controllers/internshipController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', authorize('superadmin', 'admin'), createInternship);
router.get('/', authorize('superadmin', 'admin', 'intern'), getInternships);

module.exports = router;
