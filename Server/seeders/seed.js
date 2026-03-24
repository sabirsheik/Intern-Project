const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { sequelize, User, Task, Notification } = require('../models');

dotenv.config();

const seedUsers = [
  {
    name: 'Super Admin',
    email: 'Superadmin@intern.com',
    password: 'password',
    role: 'superadmin'
  },
  {
    name: 'Admin User',
    email: 'admin@intern.com',
    password: 'password',
    role: 'admin'
  },
  {
    name: 'Intern User',
    email: 'intern@intern.com',
    password: 'password',
    role: 'intern'
  }
];

const runSeeder = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const usersToCreate = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    const createdUsers = await User.bulkCreate(usersToCreate, { returning: true });
    const internUser = createdUsers.find((user) => user.role === 'intern');

    await Task.bulkCreate([
      {
        intern_id: internUser.id,
        title: 'E-commerce Frontend 2',
        description: 'Complete the E-commerce Frontend project according to domain standards and best practices.',
        deadline: '2026-03-22',
        status: 'in_progress',
        estimated_hours: 14
      },
      {
        intern_id: internUser.id,
        title: 'Authentication System 5',
        description: 'Complete the Authentication System project according to domain standards and best practices.',
        deadline: '2026-04-01',
        status: 'in_progress',
        estimated_hours: 25
      },
      {
        intern_id: internUser.id,
        title: 'Build a Responsive Portfolio Website',
        description: 'Create a personal portfolio website using HTML, CSS, and JavaScript with responsive sections.',
        deadline: '2026-04-02',
        status: 'in_progress',
        estimated_hours: 20
      },
      {
        intern_id: internUser.id,
        title: 'Dashboard Analytics 6',
        description: 'Implement analytics widgets and progress insights for internship tracking dashboard.',
        deadline: '2026-03-22',
        status: 'completed',
        estimated_hours: 10,
        submitted_at: new Date('2026-03-17T10:30:00Z')
      }
    ]);

    await Notification.bulkCreate([
      {
        intern_id: internUser.id,
        title: 'Weekly Demo Meeting',
        message: 'Reminder: Join the weekly demo meeting at 4:00 PM with your progress updates.',
        type: 'announcement'
      },
      {
        intern_id: internUser.id,
        title: 'Task Review Update',
        message: 'Your latest submission has been reviewed. Open Grades tab for detailed rubric feedback.',
        type: 'grade'
      },
      {
        intern_id: null,
        title: 'Portal Maintenance Window',
        message: 'The portal will be under maintenance on Sunday 1:00 AM to 2:00 AM.',
        type: 'announcement'
      }
    ]);

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

runSeeder();
