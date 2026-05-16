<div align="center">
  <h1>🧠 SemantiScholar - Frontend Client</h1>
  <p><b>Next.js Web Application for AI-Powered Research Intelligence</b></p>

  [![Live Preview](https://img.shields.io/badge/Live_Preview-🟢_Online-10B981?style=for-the-badge&logo=vercel)](https://semantischolar-frontend-l0gbaqm7e.vercel.app/)
  [![Framework](https://img.shields.io/badge/Built_with-Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![Styling](https://img.shields.io/badge/Styling-Tailwind_v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
</div>

<br />

> This directory contains the fully responsive, dark-mode optimized Next.js frontend client for **SemantiScholar**.

## 🌐 Live Web App

Explore the live production website here:  
**🔗 [https://semantischolar-frontend-l0gbaqm7e.vercel.app/](https://semantischolar-frontend-l0gbaqm7e.vercel.app/)**

---

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env.local` file at the root of `frontend/`:
```env
NEXT_PUBLIC_API_URL=https://semantischolar-backend.onrender.com/api
# Or http://localhost:5000/api for local development
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🛠️ Architecture Highlights

- **App Router (`app/`)**: Utilizes Next.js Server & Client components for optimal initial loading performance and SEO.
- **TanStack Query & Zustand**: Robust client-side data caching and global authentication state management.
- **Framer Motion**: Smooth page transitions, modal spring animations, and hover micro-interactions.
- **React-PDF Integration**: Built-in PDF canvas worker for seamless academic paper rendering without leaving the application.
