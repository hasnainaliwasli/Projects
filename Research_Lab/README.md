# Research Lab — AI-Powered Research Workflow Assistant

A full-stack application for managing research projects, papers, notes, experiments, and tasks — powered by AI for automated paper summarization and keyword extraction.

## 🎯 Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Analytics overview with Recharts (papers/project, tasks by status, experiment runs) |
| **Project Management** | CRUD with status tracking, progress bars, tags, collaborators |
| **Smart Literature Manager** | PDF upload, AI-powered summaries (Gemini API + fallback), keyword extraction, similar paper detection via cosine similarity |
| **Structured Notes** | Idea, critique, literature gap, future extension, quote references with auto-save and version history |
| **Experiment Tracker** | Log experiments with parameters/metrics, visualize runs with line charts |
| **Kanban Task Board** | Drag-and-drop task management (To Do → In Progress → Review → Done), deadline tracking, priority badges |
| **Dark Mode** | Full dark/light theme with CSS variables |

## 🏗 Tech Stack

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens), bcrypt
- **AI:** Google Gemini API (with TextRank/TF-IDF/RAKE fallback)
- **Storage:** Cloudinary (PDF/image uploads)
- **Validation:** Zod

### Frontend
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS custom properties
- **State:** TanStack Query v5 + React Context
- **Charts:** Recharts
- **Icons:** react-icons

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary account](https://cloudinary.com/) (free tier)
- [Google AI Studio API Key](https://aistudio.google.com/) (free tier)

### 1. Clone & Install

```bash
git clone <repo-url>
cd Research_Assistant

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend** — copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```

Then fill in your values:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/research_assistant
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your-gemini-api-key
```

**Frontend** — `.env.local` is pre-configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/projects` | List projects (search, status filter, pagination) |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project details |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

### Papers
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/papers` | List papers (search, project filter, pagination) |
| POST | `/papers/upload` | Upload paper (PDF + metadata) |
| GET | `/papers/:id` | Get paper with AI summary |
| DELETE | `/papers/:id` | Delete paper |
| POST | `/papers/bulk-delete` | Bulk delete papers |
| GET | `/papers/:id/similar` | Find similar papers |
| POST | `/papers/:id/regenerate-summary` | Regenerate AI summary |

### Notes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/notes` | List notes |
| POST | `/notes` | Create note |
| PUT | `/notes/:id` | Update note (auto-saves version) |
| DELETE | `/notes/:id` | Delete note |
| GET | `/notes/:id/versions` | Get version history |

### Experiments
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/experiments` | List experiments |
| POST | `/experiments` | Create experiment |
| GET | `/experiments/:id` | Get experiment + runs |
| DELETE | `/experiments/:id` | Delete experiment |
| POST | `/experiments/runs` | Add experiment run |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id/status` | Update task status (Kanban) |
| DELETE | `/tasks/:id` | Delete task |

### Dashboard
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard/stats` | Get aggregated statistics |

---

## 📁 Project Structure

```
Research_Assistant/
├── backend/
│   ├── src/
│   │   ├── config/           # DB, Cloudinary, env config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/        # Auth, error, validation, upload
│   │   ├── models/            # Mongoose schemas (7 models)
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # AI service, Cloudinary service
│   │   ├── utils/             # TextRank, TF-IDF, RAKE, cosine
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Entry point
│   │   └── seed.ts            # Sample data script
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── dashboard/     # Dashboard with analytics
│   │   │   ├── projects/      # Project list + detail
│   │   │   ├── papers/        # Paper list + AI detail
│   │   │   ├── notes/         # Structured note editor
│   │   │   ├── experiments/   # Experiment tracker
│   │   │   ├── tasks/         # Kanban board
│   │   │   ├── login/         # Auth
│   │   │   └── register/      # Auth
│   │   ├── components/layout/ # Sidebar, Topbar, AppLayout
│   │   ├── hooks/             # TanStack Query hooks
│   │   ├── lib/               # API, Auth, Theme, Providers
│   │   └── types/             # TypeScript interfaces
│   ├── .env.local
│   └── package.json
```

---

## 🔐 Authentication Flow

1. User registers/logs in → receives `accessToken` (15min) + `refreshToken` (7d httpOnly cookie)
2. Frontend stores `accessToken` in localStorage
3. Axios interceptor attaches token to all requests
4. On 401, interceptor automatically refreshes token
5. Protected routes redirect to `/login` if unauthenticated

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set `NEXT_PUBLIC_API_URL` to your backend URL

### Backend (Render)
1. Push to GitHub
2. Create Web Service on [Render](https://render.com)
3. Set environment variables from `.env.example`
4. Build: `npm run build` | Start: `npm start`

### Database (MongoDB Atlas)
1. Create free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Add connection string to `MONGODB_URI`
