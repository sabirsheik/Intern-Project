const bcrypt = require('bcryptjs');
const { fn, col, where: sequelizeWhere } = require('sequelize');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: sequelizeWhere(fn('lower', col('email')), normalizedEmail)
  });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  let isMatch = false;

  if (typeof user.password === 'string' && user.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    // Backward compatibility: migrate legacy plain-text password to hash on successful login.
    isMatch = user.password === password;
    if (isMatch) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ id: user.id, role: user.role });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'intern' } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (!['superadmin', 'admin', 'intern'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
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
  const createdUser = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role
    }
  });
});

module.exports = {
  login,
  register
};
