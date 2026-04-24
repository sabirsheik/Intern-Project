const bcrypt = require('bcryptjs');
const { fn, col, where: sequelizeWhere } = require('sequelize');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['id', 'ASC']]
  });

  sendSuccess(res, users, 'Users retrieved successfully', 200);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return sendError(res, 'Name, email, password, and role are required', 400);
  }

  if (!['superadmin', 'admin', 'intern'].includes(role)) {
    return sendError(res, 'Invalid role', 400);
  }

  if (req.user.role === 'admin' && role !== 'intern') {
    return sendError(res, 'Admin can only create intern users', 403);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    where: sequelizeWhere(fn('lower', col('email')), normalizedEmail)
  });
  
  if (existingUser) {
    return sendError(res, 'User with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  sendSuccess(res, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }, 'User created successfully', 201);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  if (req.user.role === 'admin' && user.role !== 'intern') {
    return sendError(res, 'Admin can only delete intern users', 403);
  }

  await user.destroy();

  sendSuccess(res, null, 'User deleted successfully', 200);
});

module.exports = {
  getUsers,
  createUser,
  deleteUser
};
