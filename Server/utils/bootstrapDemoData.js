const bcrypt = require('bcryptjs');
const { User, Task, Notification } = require('../models');

const ensureUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ where: { email: normalizedEmail } });

  if (existing) {
    return existing;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role
  });
};

const bootstrapDemoData = async () => {
  const superAdmin = await ensureUser({
    name: 'Super Admin',
    email: 'Superadmin@intern.com',
    password: 'password',
    role: 'superadmin'
  });

  const admin = await ensureUser({
    name: 'Admin User',
    email: 'admin@intern.com',
    password: 'password',
    role: 'admin'
  });

  const intern = await ensureUser({
    name: 'Intern User',
    email: 'intern@intern.com',
    password: 'password',
    role: 'intern'
  });

  const existingTasks = await Task.count({ where: { intern_id: intern.id } });
  if (existingTasks === 0) {
    await Task.bulkCreate([
      {
        intern_id: intern.id,
        title: 'E-commerce Frontend 2',
        description: 'Complete the E-commerce Frontend project according to domain standards and best practices.',
        deadline: '2026-03-22',
        status: 'in_progress',
        estimated_hours: 14
      },
      {
        intern_id: intern.id,
        title: 'Authentication System 5',
        description: 'Complete the Authentication System project according to domain standards and best practices.',
        deadline: '2026-04-01',
        status: 'in_progress',
        estimated_hours: 25
      },
      {
        intern_id: intern.id,
        title: 'Build a Responsive Portfolio Website',
        description: 'Create a personal portfolio website using HTML, CSS, and JavaScript with responsive sections.',
        deadline: '2026-04-02',
        status: 'in_progress',
        estimated_hours: 20
      },
      {
        intern_id: intern.id,
        title: 'Dashboard Analytics 6',
        description: 'Implement analytics widgets and progress insights for internship tracking dashboard.',
        deadline: '2026-03-22',
        status: 'completed',
        estimated_hours: 10,
        submitted_at: new Date('2026-03-17T10:30:00Z')
      }
    ]);
  }

  const existingNotifications = await Notification.count({ where: { intern_id: intern.id } });
  if (existingNotifications === 0) {
    await Notification.bulkCreate([
      {
        intern_id: intern.id,
        title: 'Weekly Demo Meeting',
        message: 'Reminder: Join the weekly demo meeting at 4:00 PM with your progress updates.',
        type: 'announcement'
      },
      {
        intern_id: intern.id,
        title: 'Task Review Update',
        message: 'Your latest submission has been reviewed. Open Grades tab for detailed rubric feedback.',
        type: 'grade'
      }
    ]);
  }

  const systemAnnouncement = await Notification.findOne({
    where: { title: 'Portal Maintenance Window', intern_id: null }
  });

  if (!systemAnnouncement) {
    await Notification.create({
      intern_id: null,
      title: 'Portal Maintenance Window',
      message: 'The portal will be under maintenance on Sunday 1:00 AM to 2:00 AM.',
      type: 'announcement'
    });
  }

  return { superAdmin, admin, intern };
};

module.exports = bootstrapDemoData;
