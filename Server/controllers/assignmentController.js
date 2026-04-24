const { InternAssignment, Internship, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const assignInternship = asyncHandler(async (req, res) => {
  const { intern_id, internship_id, status = 'active' } = req.body;

  if (!intern_id || !internship_id) {
    return sendError(res, 'intern_id and internship_id are required', 400);
  }

  const intern = await User.findByPk(intern_id);
  if (!intern || intern.role !== 'intern') {
    return sendError(res, 'Intern user not found', 404);
  }

  const internship = await Internship.findByPk(internship_id);
  if (!internship) {
    return sendError(res, 'Internship not found', 404);
  }

  const existing = await InternAssignment.findOne({
    where: { intern_id, internship_id }
  });

  if (existing) {
    return sendError(res, 'This intern is already assigned to this internship', 409);
  }

  const assignment = await InternAssignment.create({
    intern_id,
    internship_id,
    status
  });

  sendSuccess(res, assignment, 'Internship assigned successfully', 201);
});

const getAssignments = asyncHandler(async (req, res) => {
  const whereClause = req.user.role === 'intern' ? { intern_id: req.user.id } : {};

  const assignments = await InternAssignment.findAll({
    where: whereClause,
    include: [
      { model: User, as: 'intern', attributes: ['id', 'name', 'email'] },
      { model: Internship, as: 'internship' }
    ],
    order: [['id', 'DESC']]
  });

  sendSuccess(res, assignments, 'Assignments retrieved successfully', 200);
});

module.exports = {
  assignInternship,
  getAssignments
};
