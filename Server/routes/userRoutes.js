const express = require('express');
const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', authorize('superadmin', 'admin'), getUsers);
router.post('/', authorize('superadmin', 'admin'), createUser);
router.delete('/:id', authorize('superadmin', 'admin'), deleteUser);

module.exports = router;
