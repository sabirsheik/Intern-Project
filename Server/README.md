# Intern Portal Backend

## Setup

1. Install dependencies:
   npm install
2. Create `.env` from `.env.example`.
3. Ensure MySQL is running and database `intern_portal` exists.
4. Seed initial credentials:
   npm run seed
5. Start server:
   npm run dev

## Seed Login Credentials

- Super Admin: Superadmin@intern.com / password
- Admin: admin@intern.com / password
- Intern: intern@intern.com / password

## API Base URL

- http://localhost:5000/api

## Routes

- POST /auth/login
- POST /auth/register
- GET /users
- POST /users
- DELETE /users/:id
- POST /internships
- GET /internships
- POST /assign
- GET /assignments
- POST /reports
- GET /reports
