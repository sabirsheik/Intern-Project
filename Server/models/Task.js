const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    intern_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    estimated_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 8
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'tasks',
    underscored: true,
    timestamps: true
  }
);

module.exports = Task;
