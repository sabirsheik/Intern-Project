const bcrypt = require('bcryptjs');
const { fn, col, where: sequelizeWhere } = require('sequelize');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: sequelizeWhere(fn('lower', col('email')), normalizedEmail)
  });

  if (!user) {
    return sendError(res, 'Invalid credentials', 401);
  }

  let isMatch = false;

  if (typeof user.password === 'string' && user.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    // Backward compatibility: migrate legacy plain-text password to hash on successful login
    isMatch = user.password === password;
    if (isMatch) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 401);
  }

  const token = generateToken({ id: user.id, role: user.role });

  sendSuccess(res, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }, 'Login successful', 200);
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'intern' } = req.body;

  // Validation
  if (!name || !email || !password) {
    return sendError(res, 'Name, email, and password are required', 400);
  }

  if (!['superadmin', 'admin', 'intern'].includes(role)) {
    return sendError(res, 'Invalid role', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    where: sequelizeWhere(fn('lower', col('email')), normalizedEmail)
  });

  if (existingUser) {
    return sendError(res, 'User with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  const token = generateToken({ id: createdUser.id, role: createdUser.role });

  sendSuccess(res, {
    token,
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role
    }
  }, 'User registered successfully', 201);
});

module.exports = {
  login,
  register
};
