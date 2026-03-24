const express = require('express');
const { login, register } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', protect, authorize('superadmin', 'admin'), register);

module.exports = router;
