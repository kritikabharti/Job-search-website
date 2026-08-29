# Recruiter Profile Page

Implemented `/recruiter/profile` as a functional recruiter profile page.

## Frontend
- `frontend/src/pages/recruiter/RecruiterProfile.jsx`
- Uses the shared Axios client.
- Loads from `GET /api/recruiter/profile`.
- Saves with `PUT /api/recruiter/profile`.
- Supports profile picture upload.
- Includes recruiter name, designation, company, phone, location, headline, bio, LinkedIn, website and portfolio.
- Handles authentication errors and redirects to `/login`.

## Backend
- `GET /api/recruiter/profile`
- `PUT /api/recruiter/profile`
- Both are protected with recruiter authorization.
- Added recruiter profile fields to `User`: `company`, `designation`, `website`.
- Profile image upload uses the existing upload middleware.

## URL structure
Because the Axios base URL is `http://localhost:5000/api`, frontend calls intentionally use:
- `/recruiter/profile`
- `/recruiter/dashboard`

They resolve to:
- `http://localhost:5000/api/recruiter/profile`
- `http://localhost:5000/api/recruiter/dashboard`

Do not write `/api/recruiter/profile` in `api.get()` or `api.put()` because that would create a duplicate `/api/api/...` URL.
