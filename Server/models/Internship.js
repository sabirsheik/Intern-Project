const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Internship = sequelize.define(
  'Internship',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'internships',
    underscored: true,
    timestamps: true,
    updatedAt: false
  }
);

module.exports = Internship;
