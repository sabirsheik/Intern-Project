const { Internship, User, InternAssignment } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createInternship = asyncHandler(async (req, res) => {
  const { title, description, domain } = req.body;

  if (!title || !description || !domain) {
    return sendError(res, 'Title, description, and domain are required', 400);
  }

  const internship = await Internship.create({
    title,
    description,
    domain,
    created_by: req.user.id
  });

  sendSuccess(res, internship, 'Internship created successfully', 201);
});

const getInternships = asyncHandler(async (req, res) => {
  if (req.user.role === 'intern') {
    const assignments = await InternAssignment.findAll({
      where: { intern_id: req.user.id },
      include: [
        {
          model: Internship,
          as: 'internship',
          include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
        }
      ],
      order: [['id', 'DESC']]
    });

    const internInternships = assignments.map((item) => ({
      assignment_id: item.id,
      status: item.status,
      internship: item.internship
    }));

    return sendSuccess(res, internInternships, 'Internships retrieved successfully', 200);
  }

  const internships = await Internship.findAll({
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    order: [['id', 'DESC']]
  });

  return sendSuccess(res, internships, 'Internships retrieved successfully', 200);
});

module.exports = {
  createInternship,
  getInternships
};
