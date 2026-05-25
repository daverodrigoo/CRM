# CHIMES CRM — Frontend Technical Documentation

This document is a comprehensive technical reference for developers taking over the codebase. It focuses on the frontend service located at `frontend/` in this repository but contains cross-references to the backend and infrastructure where relevant.

Contents
- **Overview**: high-level purpose and components
- **Architecture**: component diagram and data flow
- **Prerequisites**: software required for development and deployment
- **Local development**: step-by-step instructions for frontend and backend
- **Docker**: how to run and debug using Docker and docker-compose
- **Environment variables**: required variables and examples
- **Database & migrations**: running migrations and seeders
- **CSV Bulk Import**: how CSV uploads are handled in the browser
- **Authentication & session**: how auth works and localStorage keys
- **API summary**: core backend routes and endpoints
- **Notifications & emails**: how meeting and lead notifications flow
- **Testing & linting**: test suites and static analysis
- **Build & deploy**: production build and deployment guidance
- **Troubleshooting**: common issues and solutions
- **Code map**: important files and responsibilities
- **Maintenance & changelog guidance**

**Note:** This README is stored in the `frontend/` folder and focuses primarily on the React + Vite application, but it documents interactions with the Laravel backend (`backend/`).

**IMPORTANT LOCAL KEYS & BEHAVIORS**
- **Key localStorage items used by the app:** `AUTH_TOKEN`, `USER_ROLE`, `USER_NAME`, `USER_ID`, `USER_EMAIL`, `CRM_READ_NOTIFS`.
- `CRM_READ_NOTIFS` is persisted across logout/login by design — logout implementations should avoid `localStorage.clear()`.
- `USER_EMAIL` must be set by the login flow so the `Account` page can display the user's email.

**Quick Links**
- Frontend root: `frontend/`
- Backend root: `backend/`

---

**Overview**

CHIMES CRM is a two-service web application:
- Frontend: React 18 application built with Vite, Tailwind CSS for styling, Axios for API calls.
- Backend: Laravel PHP API (routes under `backend/routes/api.php`) providing authentication, lead management, assigned leads, and email notifications.

High-level responsibilities:
- Frontend: UI, routing, optimistic updates, local state, and user experience.
- Backend: business logic, database persistence, email sending, and API security.

---

**Architecture & Data Flow**

1. User interacts with the React UI in the browser.
2. Frontend authenticates via `/api/login` and stores the token in `AUTH_TOKEN`.
3. Frontend calls protected endpoints (e.g., `/api/leads`) sending `Authorization: Bearer <token>`.
4. Backend updates DB (MySQL/MariaDB) and triggers emails using Laravel mailables (e.g., `MeetingBookedMail`).
5. Notifications state: read/unread is kept client-side with `CRM_READ_NOTIFS` and server-side events are delivered via API polling or push (implementation dependent).

Diagram (textual):

Browser (React/Vite) -> Axios -> Laravel API -> Database / Mail

---

**CSV Bulk Import**

The CRM includes a frontend CSV lead import feature, backed by a template file in `frontend/public/Leads Template.xlsx`.

- The browser reads the uploaded `.csv` file with `FileReader`.
- The frontend parses CSV text into rows and headers, normalizes dates, validates each row, and builds a JSON lead object.
- The implementation is all-or-nothing: if any row fails validation, the entire import is rejected client-side.
- For each valid imported lead, the frontend sends one `POST http://localhost:8000/api/leads` request to the backend.
- This means the bulk import is handled in the browser, and the backend receives individual JSON lead payloads, not a multipart CSV file upload.

The import engine also:
- skips template/instruction rows,
- normalizes `Acquisition_Date` formats to `YYYY-MM-DD`,
- treats `Social_Media` values as semicolon-delimited arrays,
- performs duplicate detection both inside the CSV and against existing database leads.

---

**Prerequisites**

- Node.js >= 18.x (LTS recommended)
- npm >= 9.x or yarn
- PHP >= 8.1
- Composer
- MySQL / MariaDB
- Docker & docker-compose (optional, recommended for parity)

Tools used by the repo:
- Frontend: Vite, React 18, Tailwind CSS, ESLint
- Backend: Laravel, PHPUnit

---

**Local Development — Frontend**

1. Install dependencies

```bash
cd frontend
npm install
# or: yarn
```

2. Dev server

```bash
npm run dev
# Default dev output from esbuild/vite shows the local host URL (usually http://localhost:5173)
```

3. Build for production

```bash
npm run build
```

4. Serve production build locally (optional)

```bash
npm run preview
```

5. Key scripts in `frontend/package.json` (verify actual scripts there):
- `dev` — run Vite dev server
- `build` — produce production assets
- `preview` — preview the production build

6. Debugging client-side network/API issues
- Open browser devtools -> Network tab and inspect requests to `http://localhost:8000/api/*`.
- Check `AUTH_TOKEN` header; token is added by Axios instance used by the app.

---

Local Development — Backend (quick guide)

1. Install PHP dependencies and create `.env`

```bash
cd backend
composer install
cp .env.example .env
# update DB and other settings in .env
php artisan key:generate
```

2. Run migrations & seeders

```bash
php artisan migrate
php artisan db:seed
```

3. Run Laravel dev server

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

4. Mail testing
- Configure mail in `backend/.env` (`MAIL_MAILER=log` or SMTP). Laravel's `log` mailer writes mail contents to `storage/logs/laravel.log` for local testing.

---

**Docker / docker-compose**

This repository has a `docker-compose.yml` at the project root. Use docker-compose to get a consistent local environment (recommended):

```bash
docker-compose up --build
```

Typical services in the compose setup:
- `app` — Laravel PHP container
- `frontend` — optional static server for built assets or separate node container
- `db` — MySQL / MariaDB
- `mail` / `mailhog` — for capturing outbound mails in dev

When using docker, set API base URLs in the frontend environment or proxy through the web server so `http://localhost:8000` remains the correct API host from the browser.

---

**Environment Variables**

Frontend (example `.env` values used by Vite):
- `VITE_API_BASE_URL=http://localhost:8000/api`

Backend (`backend/.env`) — essential keys:
- `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_URL`
- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`

Security note: Never commit `.env` files. Use `.env.example` as a template.

---

**Database & Migrations**

Core migration notes:
- `database/migrations/2026_03_09_232504_create_businesses_table.php`
- `database/migrations/2026_03_09_232541_create_leads_table.php`

Seed data:
- The seeder file is `backend/database/seeders/DatabaseSeeder.php`.
- It creates three default test accounts:
  - `superadmin@chimes.com` / `password123` (`Super Admin`)
  - `admin@chimes.com` / `password123` (`Admin`)
  - `employee@chimes.com` / `password123` (`Employee`)

Run full migration + seed pipeline:

```bash
php artisan migrate --seed
```

If you need to reset:

```bash
php artisan migrate:fresh --seed
```

---

**Authentication & Session**

Authentication flow:
- Frontend sends `POST /api/login` with `{ email, password }`.
- Backend returns `{ user, token }`.
- Frontend stores several keys in `localStorage`:
	- `AUTH_TOKEN`: string token used for `Authorization` header
	- `USER_ROLE`: role string
	- `USER_NAME`: user display name
	- `USER_ID`: numeric/string id
	- `USER_EMAIL`: email address (must be set by login handler)
	- `CRM_READ_NOTIFS`: client-side set of read notification IDs (persisted intentionally across logout)

Implementation note: the login handler in `frontend/src/pages/Login.jsx` must set `USER_EMAIL` to allow `Account.jsx` to display email. Avoid `localStorage.clear()` during logout; instead remove keys selectively to preserve `CRM_READ_NOTIFS`.

**Authentication Protocol**

The backend uses **Laravel Sanctum** for API authentication. The frontend stores `AUTH_TOKEN` in localStorage and sends it as a bearer token with protected requests. Laravel's `auth:sanctum` middleware validates that token on the backend.

This means:
- `AUTH_TOKEN` is not a session cookie; it is a Sanctum API token.
- The API routes that require authentication are protected by Sanctum middleware.
- A Laravel developer should inspect `config/sanctum.php` and `create_personal_access_tokens_table` migration for token behavior.

**User Roles & Permissions**

The app uses roles to gate UI and backend behavior. The most common roles are:
- `Super Admin`: full access to users, leads, assignments, settings, and system-wide administration.
- `Admin`: access to lead creation, assignment pipelines, employee management, and reporting features.
- `Employee`: restricted access to assigned leads, meeting booking, and their own dashboard data.

**API Summary**

Core routes defined in `backend/routes/api.php`:
- Auth:
  - `POST /api/login`
  - `POST /api/forgot-password`
  - `POST /api/reset-password`
- Leads:
  - `GET /api/leads`
  - `POST /api/leads`
  - `DELETE /api/leads/{id}`
  - `PUT /api/leads/{id}`
  - `PUT /api/leads/{id}/pipeline`
  - `GET /api/leads/{id}/history`
- Assignment / Pipeline:
  - `POST /api/leads/assign`
  - `PUT /api/assigned-leads/{assignedLeadId}`
  - `PUT /api/assigned-leads/{id}/book-meeting`
  - `PATCH /api/assigned-leads/{id}/status`
- Meetings / summaries:
  - `GET /api/assigned-leads/summary`
  - `GET /api/leads/assigned/{userId}`
  - `GET /api/meetings/admin/{userId}`
  - `GET /api/meetings/employee-booked/{employeeId}`
  - `GET /api/meetings/all-booked`
- Employees:
  - `GET /api/employees`
  - `POST /api/employees`
  - `PUT /api/employees/{id}`
  - `DELETE /api/employees/{id}`
- User management:
  - `PUT /api/users/{id}/change-password`

---

**Notifications, Meetings, and Emails**

Key backend files:
- `backend/app/Mail/MeetingBookedMail.php` — email content for meeting booked
- `backend/app/Http/Controllers/Api/LeadController.php` — endpoints for bookMeeting() and lead operations

Frontend behavior:
- Dashboard notification rules check that for meeting booked notifications, the current user is the assignee: `isBooked && String(meetingAssignee) === String(currentUserId)`.
- Meeting booking endpoint sets `Meeting_Booked = true` on `AssignedLead` and backend triggers `MeetingBookedMail`.
- Optimistic UI: the frontend sets `Meeting_Booked: true` locally after successful booking to reflect state immediately.

**Email Workflows**

The application sends three main transactional emails:
- `WelcomeEmployeeMail` — triggered when an admin creates a new user account via `POST /api/employees`.
- `LeadAssignedMail` — triggered during lead assignment through the assignment batch pipeline; this mail informs the assigned employee about their new lead(s).
- `MeetingBookedMail` — triggered when a sales rep updates an `AssignedLead` record to booked via `PUT /api/assigned-leads/{id}/book-meeting`.

Each email is sent by a Laravel Mailable class under `backend/app/Mail/` and is tied to the business flow:
- new user onboarding,
- lead assignment notifications,
- booked meeting confirmations.

Best practices & debug tips:
- If a meeting notification isn't visible to an admin, confirm `AssignedLead.Meeting_Booked` is true in the DB and that the dashboard filters use the correct `Meeting_Assigned_to` field.
- Check `storage/logs/laravel.log` for email sending errors or `Mail` driver logs.

---

**Testing**

Backend:
- PHPUnit tests are available in `backend/tests`. Run with:

```bash
cd backend
vendor/bin/phpunit
```

Frontend:
- The project may include unit/feature tests (Jest/React Testing Library) if configured. Run:

```bash
cd frontend
npm test
```

E2E:
- If Cypress or Playwright is configured, use the relevant script in `package.json`.

---

**Linting & Formatting**

Frontend:
- ESLint and Prettier (if configured) should be run as pre-commit hooks or via:

```bash
npm run lint
npm run format
```

Backend:
- PHP CS Fixer or `php artisan code:style` (if provided) — otherwise rely on composer scripts or CI lint steps.

---

**Build & Deploy**

Production build (frontend):

```bash
cd frontend
npm run build

# Copy built assets to backend `public/` or serve from a static CDN
```

Deployment notes:
- Build the frontend and serve static files from the `backend/public` folder, or host separately behind a CDN.
- Ensure the backend `APP_URL` matches the public host and CORS is configured.
- Configure queue workers for emails if queued (Laravel Horizon or `php artisan queue:work`).

CI/CD suggestions:
- Run `npm ci` and `npm run build` for the frontend stage.
- Run `composer install --no-dev --optimize-autoloader` and `php artisan migrate --force` for backend deploy stage.

---

**Observability, Logs & Monitoring**

- Application logs: `backend/storage/logs/laravel.log`
- Website errors: browser console + network traces
- Mail logs: depending on `MAIL_MAILER`, use MailHog or logs
- Consider adding: Sentry for frontend JS exceptions and Laravel integration for server-side errors

---

**Troubleshooting - Common Issues & Fixes**

- esbuild/vite fails on `npm run dev`:
	- Ensure Node version matches the repo's required one.
	- Delete `node_modules` and run `npm ci`.
	- Check port conflicts and firewall rules.

- Login succeeds but Account page shows placeholder email:
	- Confirm `USER_EMAIL` exists in `localStorage` after login. The login handler must call `localStorage.setItem('USER_EMAIL', user.email)`.

- Notifications reappear after logout/login:
	- Avoid `localStorage.clear()` in logout; remove keys selectively so `CRM_READ_NOTIFS` persists.

- Meetings marked as completed still appear in Incomplete tab:
	- Pagination/filters should use `filteredMeetings` for counts and slices. Ensure frontend uses filtered arrays when computing pagination indices.

---

**Code Map — Important Files & Locations**

- `frontend/src/pages/Login.jsx` — login form and success handler (stores `AUTH_TOKEN`, `USER_EMAIL`, etc.)
- `frontend/src/pages/Account.jsx` — profile view; reads `USER_EMAIL` from localStorage
- `frontend/src/pages/Dashboard.jsx` — KPI metrics, notifications, lead counting logic and date parsing
- `frontend/src/pages/Employee_AssignedLeads.jsx` — booking meetings UI and optimistic updates
- `frontend/src/pages/Meeting.jsx` — admin meeting management and tab filtering
- `frontend/src/components/Navbar.jsx` — logout logic and navigation (should remove `USER_EMAIL` on logout)

Backend key files:
- `backend/app/Http/Controllers/Api/LeadController.php` — lead & meeting endpoints, booking logic
- `backend/app/Mail/MeetingBookedMail.php` — mail content and sending logic
- `backend/app/Models/AssignedLead.php`, `Lead.php`, `User.php` — Eloquent models

---

**Security Considerations**

- Tokens in `localStorage` are susceptible to XSS — ensure frontend sanitizes any user input and CSP is configured.
- Use `SameSite` and secure cookies for session-based authentication when applicable.
- Sanitize and validate all backend inputs using Laravel form requests and model guards.

---

**Maintenance & Changelog Guidance**

- Keep a `CHANGELOG.md` at the repo root with `Unreleased` section and semantic versioning notes.
- When fixing production bugs (e.g., `USER_EMAIL` missing), include a short note in the changelog and tests to prevent regression.

---

**Onboarding Checklist for New Engineers**

1. Install prerequisites (Node, PHP, Composer, MySQL).
2. Start database and backend (`php artisan serve`).
3. Start frontend (`npm run dev`).
4. Create a developer user via seeders or `php artisan tinker`.
5. Verify login, check `localStorage` contains keys listed above.
6. Test booking a meeting and confirm `Meeting_Booked` updates and email is logged (for local mailers).

---

If you need, I can also:
- Add a short `CONTRIBUTING.md` describing branching and PR rules.
- Add a `Makefile` or `scripts/` helpers to simplify common dev tasks.
- Add CI pipeline templates for GitHub Actions or GitLab CI.

---

Authors & Contacts
- Current Maintainer: See repo `README` at root for team contacts.

License
- Check repository root for license information.

