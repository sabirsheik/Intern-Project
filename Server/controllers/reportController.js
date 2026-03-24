const { Report, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const submitReport = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Report content is required');
  }

  const report = await Report.create({
    intern_id: req.user.id,
    content
  });

  res.status(201).json(report);
});

const getReports = asyncHandler(async (req, res) => {
  const whereClause = req.user.role === 'intern' ? { intern_id: req.user.id } : {};

  const reports = await Report.findAll({
    where: whereClause,
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }],
    order: [['submitted_at', 'DESC']]
  });

  res.status(200).json(reports);
});

module.exports = {
  submitReport,
  getReports
};
