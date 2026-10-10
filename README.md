# NITHYA Yoga & Wellness | Full-Stack Application

A comprehensive, production-ready Yoga & Mindful Wellness application featuring:
- **Client Application**: React 18 frontend with original visual design, bilingual support (English / தமிழ்), custom theme switcher, 3D spatial meditation audio, and interactive widgets (Breathing Orb, Smart Reminders, Yoga Notes, Asanas).
- **Backend Architecture**: Express 5 server with SQLite database (`better-sqlite3`), secure JWT token authentication, and bcrypt password hashing.
- **LiveKit Video Studio**: Real-time WebRTC live video class room supporting teacher broadcasting and student participants.
- **Admin Portal**: Instructor dashboard to schedule classes, generate secure one-time invite tokens, and audit student attendance in real time.
- **Server-Backed Attendance**: Logs member joins and leaves with exact duration calculation.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default development credentials:
- **Admin Email**: `admin@nithyayoga.com`
- **Admin Password**: `NithyaAdmin2026!` (pre-hashed in `.env` with bcrypt)
- **Port**: `8080`

### 3. Build & Run
Compile the frontend bundle:
```bash
npm run build
```

Start the unified server (serves frontend static assets + API endpoints):
```bash
npm start
# or
node serve.js
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

---

## 🧪 Testing & Verification

Run the automated 16-point integration and security test suite:
```bash
npm test
# or
node scripts/test_backend.js
```

Tests verify:
1. `GET /api/health` system availability
2. Security: Unauthenticated requests blocked (HTTP 401)
3. Security: Invalid admin passwords rejected (HTTP 401)
4. Admin login with bcrypt verification & JWT issuance
5. Admin live class scheduling (`POST /api/admin/classes`)
6. Admin class listing (`GET /api/admin/classes`)
7. Secure 7-day invite token generation (`POST /api/admin/classes/:id/invites`)
8. Public invite token resolution (`GET /api/invites/:token`)
9. Member registration & member JWT issuance (`POST /api/members/register`)
10. Security: Member role strictly forbidden from admin endpoints (HTTP 403)
11. Server-backed attendance join logging (`POST /api/attendance/join`)
12. Server-backed attendance departure & duration calculation (`POST /api/attendance/leave`)
13. Admin attendance audit log querying (`GET /api/admin/attendance`)

---

## 🔒 Security Architecture

1. **Server-Enforced Authorization**:
   - Client-supplied roles (e.g. `{ role: 'admin' }`) are never trusted.
   - Admin access strictly requires an `Authorization: Bearer <token>` header containing a server-signed JWT with `{ role: 'admin' }`.
   - Admin tokens are only issued by `POST /api/admin/login` after verifying the password against `ADMIN_PASSWORD_HASH` using `bcrypt.compareSync`.

2. **LiveKit Token Security**:
   - LiveKit API Key and Secret are kept entirely on the server.
   - Tokens for instructors (`canPublish: true`, `roomAdmin: true`) require an authenticated admin JWT.
   - Tokens for students require a registered member JWT or valid invite token.

3. **Database Security**:
   - Invite tokens are stored as SHA-256 hashes in SQLite; raw tokens are never persisted in plaintext.

---

## 📡 API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Healthcheck and server timestamp |
| `/api/admin/login` | POST | Public | Authenticate admin with email + password |
| `/api/admin/classes` | GET | Admin JWT | List all scheduled classes |
| `/api/admin/classes` | POST | Admin JWT | Create a new scheduled class |
| `/api/admin/classes/:id/invites` | POST | Admin JWT | Generate a secure 7-day invite token |
| `/api/admin/attendance` | GET | Admin JWT | Query member attendance logs |
| `/api/invites/:token` | GET | Public | Resolve class information for an invite link |
| `/api/members/register` | POST | Public | Register student via invite token and receive member JWT |
| `/api/livekit/token` | POST | Optional | Generate WebRTC session token for video room |
| `/api/livekit/status` | GET | Public | Check if LiveKit credentials are configured |
| `/api/livekit/config` | POST | Admin JWT | Update LiveKit cloud credentials |
| `/api/attendance/join` | POST | Member/Admin | Record live class room join |
| `/api/attendance/leave` | POST | Member/Admin | Record live class departure & duration |

---

## 🌐 Deployment Guidelines

> **Note on GitHub Pages**:
> GitHub Pages only hosts static files (`HTML/CSS/JS`). To run the backend in production:
> 1. Host the static frontend on GitHub Pages or Netlify.
> 2. Deploy this Node.js backend (`serve.js` / `server.js`) to a Node-capable platform such as Render, Railway, Fly.io, or Heroku.
> 3. Update `FRONTEND_URL` and `FRONTEND_ORIGIN` in the backend environment variables.
> 4. Update the frontend `API_URL` to point to the hosted backend domain.
