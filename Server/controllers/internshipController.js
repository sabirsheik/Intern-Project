const { Internship, User, InternAssignment } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const createInternship = asyncHandler(async (req, res) => {
  const { title, description, domain } = req.body;

  if (!title || !description || !domain) {
    res.status(400);
    throw new Error('Title, description, and domain are required');
  }

  const internship = await Internship.create({
    title,
    description,
    domain,
    created_by: req.user.id
  });

  res.status(201).json(internship);
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

    return res.status(200).json(internInternships);
  }

  const internships = await Internship.findAll({
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    order: [['id', 'DESC']]
  });

  return res.status(200).json(internships);
});

module.exports = {
  createInternship,
  getInternships
};
