const sequelize = require('../config/db');
const User = require('./User');
const Internship = require('./Internship');
const InternAssignment = require('./InternAssignment');
const Report = require('./Report');
const Task = require('./Task');
const Notification = require('./Notification');

User.hasMany(Internship, {
  foreignKey: 'created_by',
  as: 'createdInternships'
});
Internship.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

User.hasMany(InternAssignment, {
  foreignKey: 'intern_id',
  as: 'assignments'
});
InternAssignment.belongsTo(User, {
  foreignKey: 'intern_id',
  as: 'intern'
});

Internship.hasMany(InternAssignment, {
  foreignKey: 'internship_id',
  as: 'assignments'
});
InternAssignment.belongsTo(Internship, {
  foreignKey: 'internship_id',
  as: 'internship'
});

User.hasMany(Report, {
  foreignKey: 'intern_id',
  as: 'reports'
});
Report.belongsTo(User, {
  foreignKey: 'intern_id',
  as: 'intern'
});

User.hasMany(Task, {
  foreignKey: 'intern_id',
  as: 'tasks'
});
Task.belongsTo(User, {
  foreignKey: 'intern_id',
  as: 'intern'
});

User.hasMany(Notification, {
  foreignKey: 'intern_id',
  as: 'notifications'
});
Notification.belongsTo(User, {
  foreignKey: 'intern_id',
  as: 'intern'
});

module.exports = {
  sequelize,
  User,
  Internship,
  InternAssignment,
  Report,
  Task,
  Notification
};
