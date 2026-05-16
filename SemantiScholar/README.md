# SemantiScholar 🧠

![SemantiScholar Banner](https://via.placeholder.com/1200x400/0f172a/38bdf8?text=SemantiScholar+-+AI+Powered+Research+Platform)

> **A modern, production-ready AI-powered research platform built with the MERN stack and Next.js.**

SemantiScholar (formerly Aasi) is an advanced web application designed to help researchers, students, and professionals organize their academic papers and interact with them using cutting-edge Artificial Intelligence. 

## ✨ Key Features

- **🤖 AI Research Assistant**: Ask complex questions about your documents and get answers based *strictly* on the text inside your PDFs using the Llama 3.3 model (via Groq).
- **📝 Instant Summarization**: Automatically generate comprehensive, well-structured summaries of lengthy research papers with a single click.
- **📂 Project Management**: Organize your research into focused workspaces. Upload, assign, and manage hundreds of PDFs effortlessly.
- **🔒 Secure Authentication**: Robust, encrypted email & password authentication system using JWT.
- **🎨 Stunning UI/UX**: Built with a beautiful, responsive dark-mode interface featuring smooth micro-animations powered by Framer Motion.
- **⚡ Lightning Fast**: Utilizes Next.js App Router, Server-Side Rendering (SSR), and React Query for instantaneous data fetching and caching.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack React Query](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Rendering**: React-PDF

### Backend (API)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **AI Integration**: [Groq API](https://groq.com/) (Llama 3.3 70B Versatile)
- **Security**: bcryptjs, jsonwebtoken, CORS
- **PDF Parsing**: pdf-parse

---

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI
- Groq API Key (for AI features)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/SemantiScholar.git
cd SemantiScholar
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file in the `backend` directory and add the following:
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

Start the backend development server:
\`\`\`bash
npm run dev
\`\`\`
*The server will start on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`

Create a \`.env.local\` file in the `frontend` directory:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`
*The client will start on http://localhost:3000*

---

## 📁 Folder Structure

\`\`\`text
SemantiScholar/
├── backend/                  # Express API Server
│   ├── controllers/          # Route logic (Auth, AI, Projects, Papers)
│   ├── middleware/           # Auth protection, Error handling, File upload
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route definitions
│   ├── utils/                # Helper functions
│   └── server.js             # Entry point
│
└── frontend/                 # Next.js Application
    ├── app/                  # App Router (Pages, Layouts)
    │   ├── (auth)/           # Login & Register flows
    │   └── dashboard/        # Protected application routes
    ├── components/           # Reusable UI components
    │   ├── auth/             # Authentication forms
    │   ├── layout/           # Navbar, Sidebar, Containers
    │   ├── papers/           # PDF viewer, Upload modals
    │   └── ui/               # Buttons, Cards, Animated Modals
    ├── lib/                  # Axios instances, API helpers
    └── store/                # Zustand global state (Auth)
\`\`\`

---

## 📦 Deployment

Both the frontend and backend are fully production-ready.

- **Frontend**: Can be easily deployed to [Vercel](https://vercel.com/) with zero configuration. Simply connect your GitHub repository and set the `NEXT_PUBLIC_API_URL` environment variable.
- **Backend**: Can be deployed to platforms like [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku]. Ensure you provide the necessary `.env` variables (MongoDB URI, JWT Secret, Groq API Key).


