const { InternAssignment, Internship, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const assignInternship = asyncHandler(async (req, res) => {
  const { intern_id, internship_id, status = 'active' } = req.body;

  if (!intern_id || !internship_id) {
    res.status(400);
    throw new Error('intern_id and internship_id are required');
  }

  const intern = await User.findByPk(intern_id);
  if (!intern || intern.role !== 'intern') {
    res.status(404);
    throw new Error('Intern user not found');
  }

  const internship = await Internship.findByPk(internship_id);
  if (!internship) {
    res.status(404);
    throw new Error('Internship not found');
  }

  const existing = await InternAssignment.findOne({
    where: { intern_id, internship_id }
  });

  if (existing) {
    res.status(409);
    throw new Error('This intern is already assigned to this internship');
  }

  const assignment = await InternAssignment.create({
    intern_id,
    internship_id,
    status
  });

  res.status(201).json(assignment);
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

  res.status(200).json(assignments);
});

module.exports = {
  assignInternship,
  getAssignments
};
