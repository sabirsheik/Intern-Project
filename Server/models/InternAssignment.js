const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InternAssignment = sequelize.define(
  'InternAssignment',
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
    internship_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'completed'),
      allowNull: false,
      defaultValue: 'active'
    }
  },
  {
    tableName: 'intern_assignments',
    underscored: true,
    timestamps: false
  }
);

module.exports = InternAssignment;
