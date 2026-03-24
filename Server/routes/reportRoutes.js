const express = require('express');
const { submitReport, getReports } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', authorize('intern'), submitReport);
router.get('/', authorize('superadmin', 'admin', 'intern'), getReports);

module.exports = router;
