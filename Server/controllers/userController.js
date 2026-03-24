const bcrypt = require('bcryptjs');
const { fn, col, where: sequelizeWhere } = require('sequelize');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['id', 'ASC']]
  });

  res.status(200).json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Name, email, password, and role are required');
  }

  if (!['superadmin', 'admin', 'intern'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  if (req.user.role === 'admin' && role !== 'intern') {
    res.status(403);
    throw new Error('Admin can only create intern users');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    where: sequelizeWhere(fn('lower', col('email')), normalizedEmail)
  });
  if (existingUser) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.user.role === 'admin' && user.role !== 'intern') {
    res.status(403);
    throw new Error('Admin can only delete intern users');
  }

  await user.destroy();

  res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
  getUsers,
  createUser,
  deleteUser
};
