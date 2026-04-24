const { Report, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const submitReport = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return sendError(res, 'Report content is required', 400);
  }

  const report = await Report.create({
    intern_id: req.user.id,
    content
  });

  sendSuccess(res, report, 'Report submitted successfully', 201);
});

const getReports = asyncHandler(async (req, res) => {
  const whereClause = req.user.role === 'intern' ? { intern_id: req.user.id } : {};

  const reports = await Report.findAll({
    where: whereClause,
    include: [{ model: User, as: 'intern', attributes: ['id', 'name', 'email'] }],
    order: [['submitted_at', 'DESC']]
  });

  sendSuccess(res, reports, 'Reports retrieved successfully', 200);
});

module.exports = {
  submitReport,
  getReports
};
