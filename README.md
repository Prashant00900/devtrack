# DevTrack 🚀

**Developer Career Intelligence Platform** for students and software engineers.

Developers keep their skills, projects, certifications and GitHub activity in different places. DevTrack brings them together and answers three questions: **What skills do I have? What am I missing for my target role? What should I learn next?**

## Features

- **Auth:** JWT register/login with bcrypt password hashing and protected routes
- **Developer profile:** headline, bio, experience level, GitHub username
- **Skills:** master skill list with a 1-5 level for each skill
- **Projects:** tech stack, GitHub link, live link, status (add, edit, delete)
- **Target role:** pick a role such as MERN Stack Developer
- **Skill gap analysis:** role match percentage with strong, weak and missing skills
- **Learning roadmap:** ordered learning plan with progress tracking
- **Dashboard:** analytics with Recharts (skill levels, skills by category)
- **GitHub integration:** repos, languages and weekly activity from the GitHub API
- **Project-to-skill mapping:** finds skills used in projects and syncs them to the profile
- **AI career analysis:** summary, strengths, next steps, project ideas and interview tips (Claude API, with a rule-based fallback when no API key is set)
- **Employee mode:** promotion readiness score for the next level
- **Certifications:** add and manage certifications

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Integrations | GitHub REST API, Anthropic API (optional) |

## Project Structure

```
devtrack/
├── client/                # React app
│   └── src/
│       ├── api/           # Axios instance with token interceptor
│       ├── components/    # Navbar, Layout, ProtectedRoute
│       ├── context/       # AuthContext
│       └── pages/         # Dashboard, Skills, Projects, GapAnalysis, ...
└── server/                # Express API
    └── src/
        ├── config/        # DB connection
        ├── models/        # Mongoose models
        ├── controllers/   # Request handlers
        ├── services/      # Business logic (gap analysis, GitHub, AI, promotion)
        ├── routes/        # API routes
        ├── middleware/    # JWT auth middleware
        └── seeds/         # Skills and roles seed scripts
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A MongoDB database (MongoDB Atlas free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/Prashant00900/devtrack.git
cd devtrack
```

### 2. Setup the backend
```bash
cd server
npm install
```
Create a `.env` file (see `.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

# Optional
ANTHROPIC_API_KEY=
GITHUB_TOKEN=
```
Seed the skills and roles (run once, in this order):
```bash
node src/seeds/seedSkills.js
node src/seeds/seedRoles.js
```
Start the server:
```bash
npm run dev
```

### 3. Setup the frontend
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173`.

## API Overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Profile | `GET /api/profile`, `PUT /api/profile` |
| Skills | `GET /api/skills`, `GET/POST /api/skills/me`, `PUT/DELETE /api/skills/me/:id` |
| Projects | `GET/POST /api/projects`, `PUT/DELETE /api/projects/:id` |
| Roles | `GET /api/roles`, `GET/PUT /api/roles/target` |
| Analysis | `GET /api/analysis/gap`, `GET /api/analysis/roadmap` |
| Roadmap progress | `POST /api/roadmap-progress/toggle` |
| GitHub | `GET /api/github/summary` |
| Project skills | `GET /api/project-skills`, `POST /api/project-skills/sync` |
| AI | `POST /api/ai/analysis` |
| Promotion | `GET /api/promotion/readiness` |
| Certifications | `GET/POST /api/certifications`, `DELETE /api/certifications/:id` |

All routes except register and login are protected and need the header `Authorization: Bearer <token>`.

## How the Skill Gap Analysis Works

Each role has required skills with a minimum level and an importance (`must` has weight 2, `good` has weight 1). For every required skill the score is `min(userLevel / minLevel, 1)`, and the match percentage is the weighted average. Skills at or above the required level are **strong**, below it are **weak**, and skills the user does not have are **missing**.

## Screenshots

_Add screenshots here (Dashboard, Gap Analysis, Roadmap, GitHub)._

## Live Demo

_Coming soon._

## Roadmap

- [x] Auth, profile, skills, projects
- [x] Skill gap analysis and learning roadmap
- [x] Dashboard, GitHub integration, AI analysis, employee mode
- [ ] Mentor mode
- [ ] Company and team skill matrix
- [ ] Real-time notifications (Socket.IO)

## Author

**Prashant** · [GitHub](https://github.com/Prashant00900)