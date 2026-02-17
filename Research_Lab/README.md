# 🧠 Research Lab — AI-Powered Research Assistant

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Research Lab** is a sophisticated full-stack application designed to streamline the academic and professional research workflow. It leverages AI to automate monotonous tasks like paper summarization and keyword extraction, allowing researchers to focus on what matters most: discovery.

---

## 🎯 Key Features

### 📊 Comprehensive Dashboard
- **Analytics at a Glance:** Monitor project progress, paper counts, and task statuses.
- **Visual Insights:** Dynamic charts powered by **Recharts** for visualizing experiment runs and trends.

### 📁 Advanced Project Management
- **Full CRUD Support:** Organize research into distinct projects with tags and status tracking.
- **Collaborative Workflow:** Track progress bars and manage collaborators seamlessly.

### 🧠 Smart Literature Manager
- **AI Summarization:** Get instant summaries of complex papers (Gemini AI with robust fallbacks).
- **Metadata Extraction:** Automated keyword and reference detection.
- **Similarity Detection:** Find related research using advanced cosine similarity algorithms.
- **PDF Integration:** Seamlessly upload and manage research papers via Cloudinary.

### 📝 Structured Research Notes
- **Contextual Organization:** Categorize notes into Ideas, Critiques, Literature Gaps, and Future Extensions.
- **Version Control:** Automatic save history to track the evolution of your thoughts.

### 📊 Experiment Tracker
- **Parameter Logging:** Record every detail of your experiment runs.
- **Visualization:** Compare results visually through intuitive line charts.

### 📋 Kanban Task Board
- **Drag-and-Drop:** Intuitive task management from *To Do* to *Done*.
- **Priority Tracking:** Set deadlines and priority badges to stay on schedule.

---

## 🏗 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **State Management:** TanStack Query v5 & React Context
- **Styling:** Tailwind CSS 4.0
- **Visuals:** Recharts & React Icons
- **Editor:** @uiw/react-md-editor

### Backend
- **Runtime:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (Access/Refresh Tokens) with bcrypt security
- **AI Core:** Google Gemini API
- **Utilities:** Zod (Validation), Multer (File Handling)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)
- Cloudinary Account (for storage)
- Google AI Studio API Key (for Gemini)

### 1. Installation

```bash
# Clone the repository
git clone <repo-url>
cd Research_Lab

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Configuration

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GEMINI_API_KEY=your_gemini_key
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Running the App

```bash
# Start Backend (Terminal 1)
cd backend
npm run dev

# Start Frontend (Terminal 2)
cd frontend
npm run dev
```

---

## 📂 Architecture

```text
Research_Lab/
├── backend/            # Express.js API with TypeScript
│   ├── src/
│   │   ├── controllers/# Logic handlers
│   │   ├── models/     # Database schemas
│   │   ├── routes/     # API endpoints
│   │   └── services/   # AI & File storage services
└── frontend/           # Next.js Application
    ├── src/
    │   ├── app/        # Modern App Router pages
    │   ├── components/ # Reusable UI components
    │   └── hooks/      # Custom React Query hooks
```

---

## 👨‍💻 Developed By

Designed and Developed by [Hasnain Ali](https://github.com/hasnainaliwasli) 🚀

