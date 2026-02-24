# Job Application Tracker API (Backend)

## About

**Job Application Tracker API** is a robust backend service designed to help job seekers manage their application journey effectively. The API provides comprehensive tools to track applications, organize companies, manage reminders, and monitor interview progress—all in one centralized system.

Built with modern Node.js technologies, this API enables users to:
- Create and manage job applications with detailed tracking
- Store company information and contact details
- Upload and manage resumes/attachments per application
- Set reminders for follow-ups on applications
- View actionable analytics—track response rates, application status distribution, and interview progress
- Secure their data with JWT authentication

**Tech stack**
- Node.js + Express
- Sequelize (+ mysql2) for ORM
- Cloudinary for file uploads
- Resend for transactional emails
- JWT for auth
- nodemon for development

**Quick status**
This repo contains the backend server only. The entry point is in [backend/src/server.js](backend/src/server.js).

Getting started
- Go inside backend:

  `cd backend`

- Install dependencies:

  `npm install`

- Run in development (auto-reload):

  `npm run dev`

- Start production server:

  `npm start`

Configuration / Environment
Create a `.env` file in the `backend` folder (an example is below). The app reads values from [backend/src/config/env.js](backend/src/config/env.js).

Recommended environment variables

- `PORT` — server port (e.g. 4000)
- `NODE_ENV` — development | production
- `DB_USERNAME` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_HOST` — MySQL host
- `JWT_SECRET` — secret for signing JWTs
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `RESEND_API_KEY` — Resend API key
- `EMAIL_FROM` — sender email address
- `EMAIL_FROM_NAME` — sender display name

Example minimal .env (do NOT commit real credentials):

```
PORT=4000
NODE_ENV=development
DB_USERNAME=root
DB_PASSWORD=secret
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=hello@example.com
EMAIL_FROM_NAME="Job Application Tracker"
```

Project structure (key files)
- [backend/src/server.js](backend/src/server.js) — app entry
- [backend/src/config/env.js](backend/src/config/env.js) — environment variables
- [backend/src/config/cloudinary.js](backend/src/config/cloudinary.js) — Cloudinary setup
- [backend/src/routes](backend/src/routes) — route definitions (auth, user, company, application, reminder, dashboard)
- [backend/src/controllers](backend/src/controllers) — request handlers
- [backend/src/models](backend/src/models) — Sequelize models
- [backend/src/utils/db.js](backend/src/utils/db.js) — DB connection helper

API notes
- Routes are defined under [backend/src/routes](backend/src/routes). Inspect these files to see endpoints and required request bodies/params.
- Authentication uses JWT via `backend/src/middleware/auth.middleware.js`.

**API Reference**

Base URL: http://localhost:PORT (default `PORT` from .env)

Auth
- POST /api/auth/signup — Create account
  - Body: `{ name, email, password }`
  - Response: user id, fullName, email; sets `jwt` cookie on success

- POST /api/auth/login — Sign in
  - Body: `{ email, password }`
  - Response: user id, fullName, email; sets `jwt` cookie on success

- POST /api/auth/logout — Sign out
  - Clears auth cookie

Users
- GET /api/users/profile — Get current user profile (protected)
  - Auth: cookie JWT
  - Response: user object (password excluded)

- PUT /api/users/profile — Update profile (protected)
  - Body: `{ name?, email? }` (at least one required)
  - Response: success message

Companies
- POST /api/companies — Create company (protected)
  - Body: `{ name, industry?, size?, contactEmail? }`
  - Response: created company

- GET /api/companies — List companies for current user (protected)
  - Response: array of companies

- PUT /api/companies/:id — Update company (protected)
  - Path: `:id` company id
  - Body: `{ name?, industry?, size?, contactEmail? }`
  - Response: success message

- DELETE /api/companies/:id — Delete company (protected)
  - Response: success message

Applications
- POST /api/applications — Create application with optional file upload (protected)
  - Multipart/form-data: include `file` (resume/attachment)
  - Body fields: `name` (company), `jobTitle` (required), `applicationDate?`, `status?`, `notes?`, plus optional company fields `industry?`, `size?`, `contactEmail?`
  - Response: success message

- GET /api/applications — List applications (protected)
  - Query params (optional): `status`, `startDate`, `endDate` (ISO date strings)
  - Response: array of applications

- GET /api/applications/:id — Get single application (protected)
  - Response: application object

- PUT /api/applications/:id — Update application fields (protected)
  - Body: `{ jobTitle?, applicationDate?, status?, notes? }`
  - Response: success message

- DELETE /api/applications/:id — Delete application (protected)
  - Response: success message

Attachments
- PUT /api/applications/:id/attachments — Replace attachment for application (protected)
  - Multipart/form-data: `file` field
  - Response: success message

Reminders
- POST /api/applications/:applicationId/reminders — Create reminder for application (protected)
  - Body: `{ reminderDate }` (ISO date string)
  - Response: success message

- GET /api/applications/:applicationId/reminders/:reminderId — Get reminder (protected)
  - Response: reminder object

- DELETE /api/applications/:applicationId/reminders/:reminderId — Delete reminder (protected)
  - Response: success message

Dashboard
- GET /api/dashboard/summary — Get summary stats (protected)
  - Response: `{ totalApplications, applied, interviewed, offered, rejected, noResponse, responseRate }`

Authentication
- Protected routes require a valid JWT cookie (middleware: `protectRoute`). The server sets the `jwt` cookie on successful login/signup.

Notes & examples
- For file uploads use `multipart/form-data` and the `file` key (handled by Cloudinary via `multer-storage-cloudinary`).
- Dates should be provided as ISO date strings (e.g. `2024-08-01`).
- Inspect controller code in `backend/src/controllers` for exact response formats and validation behavior.

Testing and development
- There are no automated tests included. For manual testing use Postman or curl against the running server.
- Use `node-cron` reminders are configured in `backend/src/utils/reminder.js`.

Deployment
- Provide the environment variables in your hosting platform.
- Ensure MySQL is accessible and migrations/initialization are applied (this project uses Sequelize models directly; add migrations if desired).

Contributing
- Open an issue or submit a PR for improvements. Keep changes focused and include any needed migrations or seed data.

License
- ISC (see package.json)
