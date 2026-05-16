<div align="center">
  <h1>🧠 SemantiScholar</h1>
  <p><b>Advanced AI-Powered Academic Research & Document Intelligence Platform</b></p>

  [![Live Preview](https://img.shields.io/badge/Live_Preview-🟢_Online-10B981?style=for-the-badge&logo=vercel)](https://semantischolar-frontend-l0gbaqm7e.vercel.app/)
  [![Backend API](https://img.shields.io/badge/Backend_API-⚡_Render-4338CA?style=for-the-badge&logo=render)](https://semantischolar-backend.onrender.com)
  [![Tech Stack](https://img.shields.io/badge/Tech_Stack-MERN_%2B_Next.js-06B6D4?style=for-the-badge)](https://nextjs.org)
</div>

<br />

> **SemantiScholar** is a modern, enterprise-grade web application designed to help researchers, academics, and professionals organize their academic papers and instantly extract deep knowledge from PDFs using advanced Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG).

---

## 🌟 Live Demo & Links

- **🌐 Live Web Application**: [https://semantischolar-frontend-l0gbaqm7e.vercel.app/](https://semantischolar-frontend-l0gbaqm7e.vercel.app/)
- **⚡ Deployed Backend API**: [https://semantischolar-backend.onrender.com](https://semantischolar-backend.onrender.com)
- **📁 GitHub Monorepo**: [hasnainaliwasli/Projects](https://github.com/hasnainaliwasli/Projects)

---

## ✨ Key Features

- **🤖 AI Document Intelligence**: Ask complex questions across your uploaded research papers. Answers are synthesized strictly from document context using advanced Groq/Llama models.
- **📝 Automated Summarization**: Instantly generate structured, professional executive summaries of 50+ page PDFs with a single click.
- **📂 Workspace Isolation**: Group research into custom project workspaces. Upload, categorize, and seamlessly navigate PDF libraries.
- **🔒 Secure Authentication**: Industry-standard JWT auth with hashed passwords and secure multi-origin CORS protection.
- **🎨 Premium Dark UI**: Elegant, immersive dark mode aesthetic built with Tailwind CSS v4 and fluid micro-transitions powered by Framer Motion.
- **⚡ Blazing Fast Architecture**: Leverages Next.js App Router, Server-Side Rendering (SSR), and React Query for instantaneous page loading and cache validation.

---

## 🛠️ Technology Stack

### Frontend Architecture (`/frontend`)
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Clsx](https://github.com/lukeed/clsx)
- **State & Caching**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack React Query](https://tanstack.com/query/latest)
- **Animation Engine**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Viewing**: [React-PDF](https://github.com/wojtekmaj/react-pdf)

### Backend Architecture (`/backend`)
- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **API Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose ODM
- **AI Processing**: [Groq Cloud API](https://groq.com/) (Llama 3.3 70B Versatile)
- **Security**: bcryptjs, jsonwebtoken, robust CORS middleware
- **File & PDF Parsing**: pdf-parse, multer

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI (Atlas or Local)
- Groq Cloud API Key (`GROQ_API_KEY`)

### 1. Repository Setup
```bash
git clone https://github.com/hasnainaliwasli/Projects.git
cd Projects/SemantiScholar
```

### 2. Backend Initialization
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:3000
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Initialization
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend client:
```bash
npm run dev
```
Visit `http://localhost:3000` to access the application!

---

## 📁 Repository Structure

```text
SemantiScholar/
├── backend/                  # Node.js / Express API Server
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Business logic (Auth, AI, Projects, Papers)
│   ├── middleware/           # JWT verification, Error handling
│   ├── models/               # Mongoose DB schemas (User, Project, Paper)
│   ├── routes/               # Express route endpoints
│   └── server.js             # Application entry point
│
└── frontend/                 # Next.js Fullstack Client
    ├── app/                  # App Router hierarchy & layouts
    ├── components/           # Modular UI components (Auth, Layout, Papers)
    ├── lib/                  # Axios interceptors & API adapters
    ├── store/                # Zustand global state stores
    └── public/               # Static assets & PDF workers
```

---

<div align="center">
  <p>Built with ❤️ for academic excellence and seamless research collaboration.</p>
</div>
