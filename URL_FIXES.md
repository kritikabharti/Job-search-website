# Jobify URL / API Fixes

## Canonical API base
Frontend uses:
`http://localhost:5000/api`

Frontend API calls must be relative to that base, for example:
- `/auth/login`
- `/jobs`
- `/companies`
- `/profile/me`
- `/recruiter/dashboard`
- `/recruiter/jobs`
- `/applications/recruiter`
- `/applications/candidate/applications`
- `/admin/dashboard`

## Backend route ownership
- `/api/auth/*` -> authRoutes
- `/api/jobs*` -> public job routes
- `/api/recruiter/*` -> recruiterRoutes / recruiter job operations
- `/api/applications/*` -> applicationRoutes
- `/api/profile/*` -> profileRoutes
- `/api/companies/*` -> companyRoutes
- `/api/admin/*` -> adminRoutes

## Important
The previous project had two recruiter dashboard implementations and registered `recruiterRoutes` after the Express 404 handler. The duplicate dashboard route was removed from `jobRoutes`, and `recruiterRoutes` is now registered before the 404 handler.

The bundled backend `.env` was removed from this fixed archive so credentials are not redistributed. Copy your existing local values into `backend/.env` using `backend/.env.example` as a template.

Install dependencies after extracting:
- `cd backend && npm install`
- `cd ../frontend && npm install`

Then run backend and frontend with their existing `npm run dev` scripts.
