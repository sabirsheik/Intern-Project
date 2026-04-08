# Admin Dashboard Documentation

## Overview
The Admin Dashboard is a specialized interface for Domain Admins to manage internship operations, analytics, and domain-wide settings.

## File Structure
```
Client/src/
├── pages/
│   ├── AdminDashboard.jsx         ← Admin Dashboard (Main page)
│   ├── DashboardPage.jsx          ← Superadmin Dashboard
│   ├── InternDashboardPage.jsx    ← Intern Dashboard
│   ├── LoginPage.jsx              ← Login (with demo credentials)
│   └── [Other Pages]
├── App.jsx                        ← Routes configuration
└── context/
    └── AuthContext.jsx            ← Authentication state
```

## Admin Login Credentials
- **Email**: `admin@intern.com`
- **Password**: `password`
- **Role**: Admin (Domain Admin)

## Admin Dashboard Features

### 1. **Sidebar Navigation**
   - Dashboard (/dashboard/admin)
   - Users (/admin/users)
   - Tasks (/admin/tasks)
   - Submissions (/admin/submissions)
   - Analytics (/admin/analytics)
   - Attendance (/admin/attendance)
   - Certificates (/admin/certificates)
   - Notifications (/admin/notifications)
   - Settings (/admin/settings)

### 2. **Main Dashboard Content**
   - **Welcome Message**: "Welcome back, Sarah!" (Admin name)
   - **Domain Status**: Shows "Domain Active" badge
   - **Create Task Button**: Quick action to create tasks
   - **Stats Cards**:
     - Total Interns: 8 (+5%)
     - Active Tasks: 5 (+3)
     - Pending Reviews: 1 (↓2)
     - Avg Grade: 78.0% (+25%)

### 3. **Tabs**
   - Overview (default)
   - Interns
   - Submissions
   - Analytics

### 4. **Charts & Analytics**
   - **Weekly Progress**: Line chart showing tasks completed, submissions, and average grades over 8 weeks
   - **Grade Distribution**: Donut chart showing grade ranges (Average 70-79%)

### 5. **Bottom Sections**
   - **Top Performers**: List of best-performing interns
   - **Quick Actions**:
     - Create New Task
     - Assign Task to Interns
     - Review Pending Submissions (with badge count)
     - Generate Domain Report

## Data Structure

### Stats Object
```javascript
{
  totalInterns: 8,
  activeTasks: 5,
  pendingReviews: 1,
  avgGrade: 78.0,
  domainStatus: 'Active',
  change: { interns: '+5%', tasks: '+3', reviews: '↓2', grade: '+25%' }
}
```

### Top Performers
```javascript
{
  id: 1,
  name: 'Harper Lewis',
  avatar: '👨',
  tasksCompleted: 1,
  percentage: 78.0
}
```

## Authentication
The admin uses the demo authentication system:
- Located in: `LoginPage.jsx`
- Demo user: Sarah Williams (admin@intern.com)
- Role: `admin`

## Routing
- Admins are routed to `/dashboard/admin` after login
- Admin routes are protected by `ProtectedRoute` with `allowedRoles={['admin']}`
- Routes can only be accessed by users with `admin` role

## Future Admin Pages
The following pages are referenced but not yet implemented:
- /admin/users
- /admin/tasks
- /admin/submissions
- /admin/analytics
- /admin/attendance
- /admin/certificates
- /admin/notifications
- /admin/settings

## Styling
- Uses Tailwind CSS for responsive design
- Framer Motion for smooth animations
- Mobile-first responsive layout
- Supports desktop, tablet, and mobile views

## Interactive Elements
- Charts with SVG
- Toggle buttons
- Progress bars
- Animated cards
- Quick action buttons
- Toast notifications for user feedback

## Notes
- All data is mock data (no backend API calls)
- Local state management using React hooks
- Ready for backend integration when APIs are available
