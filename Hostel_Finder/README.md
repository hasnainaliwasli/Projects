<div align="center">

# 🏠 Hostel Finder

### Find Home Away From Home

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-hostelfinder--five.vercel.app-0ea5e9?style=for-the-badge)](https://hostelfinder-five.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚡_API-Render-46e3b7?style=for-the-badge)](https://hostel-finder-api-jtv5.onrender.com)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

A modern, full-stack **MERN** web application that connects students with safe, comfortable, and affordable hostels. Built with **Next.js 16**, **Node.js**, **MongoDB**, and **Socket.io** for a seamless, real-time experience.

---

![Hostel Finder Homepage](screenshots/homepage.png)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🖼️ Screenshots](#️-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🌐 Deployment](#-deployment)
- [📡 API Endpoints](#-api-endpoints)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (**Student**, **Owner**, **Admin**)
- Forgot/Reset password via email (Nodemailer)
- Protected routes & middleware

</td>
<td width="50%">

### 🏠 Hostel Management
- CRUD operations for hostel listings
- Multi-image upload via **Cloudinary**
- Advanced filtering (city, area, price, facilities)
- Room types with pricing (per bed / per room)

</td>
</tr>
<tr>
<td width="50%">

### 💬 Real-time Chat System
- 1-on-1 messaging between students & owners
- Powered by **Socket.io** for instant delivery
- Message editing & deletion (for me / everyone)
- Read receipts & unread notifications
- Typing indicators

</td>
<td width="50%">

### 🗺️ Interactive Maps
- **Leaflet.js** integration for map views
- Location pinning for each hostel
- Geocoding for accurate hostel placement
- Visual exploration of nearby hostels

</td>
</tr>
<tr>
<td width="50%">

### ⭐ Reviews & Ratings
- Star-based rating system (1–5)
- User reviews with edit/delete capability
- Average rating calculation per hostel
- Admin moderation of reviews

</td>
<td width="50%">

### 🛡️ Admin Dashboard
- User management (view, block, unblock, delete)
- Hostel approval & moderation
- Report management system
- Platform-wide analytics overview

</td>
</tr>
<tr>
<td width="50%">

### ❤️ Favorites & Bookmarks
- Save hostels to favorites list
- Quick access from dashboard
- Toggle favorites from any listing

</td>
<td width="50%">

### 🚨 Report System
- Users can report issues or hostels
- Admin dashboard for report resolution
- Track report status & history

</td>
</tr>
</table>

---

## 🖼️ Screenshots

<div align="center">

| Homepage | Hostel Listings |
|:-:|:-:|
| ![Homepage](screenshots/homepage.png) | ![Listings](screenshots/hostels_listing.png) |

</div>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|:--|:--|
| [Next.js 16](https://nextjs.org/) | React Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first Styling |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible UI Components |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Global State Management |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Leaflet](https://leafletjs.org/) | Interactive Maps |
| [Socket.io Client](https://socket.io/) | Real-time Communication |
| [Sonner](https://sonner.emilkowal.ski/) | Toast Notifications |

### Backend
| Technology | Purpose |
|:--|:--|
| [Node.js](https://nodejs.org/) | Runtime Environment |
| [Express.js](https://expressjs.com/) | Web Framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL Database |
| [Mongoose](https://mongoosejs.com/) | ODM for MongoDB |
| [Socket.io](https://socket.io/) | WebSocket Server |
| [Cloudinary](https://cloudinary.com/) | Cloud Image Storage |
| [JWT](https://jwt.io/) | Token Authentication |
| [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) | Password Hashing |
| [Nodemailer](https://nodemailer.com/) | Email Services |
| [Multer](https://github.com/expressjs/multer) | File Upload Handling |

### Deployment
| Service | Usage |
|:--|:--|
| [Vercel](https://vercel.com/) | Frontend Hosting |
| [Render](https://render.com/) | Backend API Hosting |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud Database |
| [Cloudinary](https://cloudinary.com/) | Media CDN |

---

## 📁 Project Structure

```
Hostel_Finder/
│
├── 📂 Backend/                    # Express.js REST API
│   ├── 📂 config/                 # Database & Cloudinary configuration
│   ├── 📂 controllers/           # Business logic handlers
│   │   ├── authController.js     # Login, Register, Password Reset
│   │   ├── hostelController.js   # CRUD for hostels
│   │   ├── chatController.js     # Chat & messaging logic
│   │   ├── reviewController.js   # Review management
│   │   ├── reportController.js   # Report handling
│   │   ├── userController.js     # User profile management
│   │   └── notificationController.js
│   ├── 📂 middleware/             # Auth, upload, error handling
│   ├── 📂 models/                # Mongoose schemas
│   ├── 📂 routes/                # API route definitions
│   ├── 📂 utils/                 # Helper utilities
│   ├── server.js                 # Entry point + Socket.io setup
│   └── package.json
│
├── 📂 Frontend/                   # Next.js 16 Application
│   ├── 📂 app/                   # App Router pages
│   │   ├── 📂 dashboard/         # Role-based dashboards
│   │   │   ├── 📂 admin/         # Admin panel (users, hostels, reports)
│   │   │   ├── 📂 owner/         # Owner dashboard (manage listings)
│   │   │   ├── 📂 student/       # Student dashboard (favorites, reviews)
│   │   │   └── 📂 chat/          # Real-time messaging
│   │   ├── 📂 hostels/           # Browse & detail pages
│   │   ├── 📂 login/             # Authentication
│   │   ├── 📂 register/          # User registration
│   │   └── page.tsx              # Landing page
│   ├── 📂 components/            # Reusable UI components
│   ├── 📂 context/               # React contexts (Socket, etc.)
│   ├── 📂 lib/                   # Redux store, slices & utilities
│   └── package.json
│
├── 📂 screenshots/                # App screenshots for README
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB Atlas** account — [Sign up](https://www.mongodb.com/atlas)
- **Cloudinary** account — [Sign up](https://cloudinary.com/)
- **Git** — [Download](https://git-scm.com/)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hasnainaliwasli/Projects.git
cd Projects
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/hostel_finder

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Password Reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend server:

```bash
npm run dev
```

> Backend runs at `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs at `http://localhost:3000`

---

## 🌐 Deployment

The application is deployed and live:

| Service | URL |
|:--|:--|
| 🌐 **Frontend** (Vercel) | [hostelfinder-five.vercel.app](https://hostelfinder-five.vercel.app/) |
| ⚡ **Backend API** (Render) | [hostel-finder-api-jtv5.onrender.com](https://hostel-finder-api-jtv5.onrender.com) |
| 🗄️ **Database** | MongoDB Atlas (Free Tier) |
| 🖼️ **Media** | Cloudinary (Free Tier) |

### Deploy Your Own

<details>
<summary>📘 <b>Backend → Render</b></summary>

1. Create a [Render](https://render.com/) account
2. **New** → **Web Service** → Connect your GitHub repo
3. Set **Root Directory** to `Backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add all environment variables from `.env.example`
7. Deploy!

</details>

<details>
<summary>📗 <b>Frontend → Vercel</b></summary>

1. Create a [Vercel](https://vercel.com/) account
2. **Import Project** → Select your GitHub repo
3. Set **Root Directory** to `Frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend.onrender.com`
5. Deploy!

</details>

> **Note**: Render's free tier spins down after 15 min of inactivity. The first request after sleep takes ~30-50 seconds.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description |
|:--|:--|:--|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login user |
| `POST` | `/forgot-password` | Send reset email |
| `POST` | `/reset-password/:token` | Reset password |

### Hostel Routes — `/api/hostels`
| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/` | Get all hostels (with filters) |
| `GET` | `/:id` | Get hostel by ID |
| `POST` | `/` | Create hostel (Owner) |
| `PUT` | `/:id` | Update hostel (Owner) |
| `DELETE` | `/:id` | Delete hostel (Owner/Admin) |

### Chat Routes — `/api/chat`
| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/` | Fetch user's chats |
| `POST` | `/` | Create/access 1-on-1 chat |
| `GET` | `/messages/:chatId` | Fetch messages |
| `POST` | `/messages` | Send message |
| `PUT` | `/messages/:id` | Edit message |
| `DELETE` | `/messages/:id` | Delete message |

### User Routes — `/api/users`
| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/` | Get all users (Admin) |
| `GET` | `/:id` | Get user profile |
| `PUT` | `/:id` | Update profile |
| `PUT` | `/:id/toggle-favorite` | Toggle favorite hostel |

### Review Routes — `/api/reviews`
| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/:hostelId` | Get reviews for hostel |
| `POST` | `/` | Create review |
| `PUT` | `/:id` | Update review |
| `DELETE` | `/:id` | Delete review |

### Report Routes — `/api/reports`
| Method | Endpoint | Description |
|:--|:--|:--|
| `GET` | `/` | Get all reports (Admin) |
| `POST` | `/` | Submit a report |
| `PUT` | `/:id` | Update report status |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

<div align="center">

## 👨‍💻 Author

**Hasnain Ali**

[![GitHub](https://img.shields.io/badge/GitHub-hasnain_Ali-181717?style=for-the-badge&logo=github)](https://github.com/hasnainaliwasli)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-hasnain_Ali-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hasnainali123)

---

⭐ **Star this repo** if you find it helpful!

Made with ❤️ and lots of ☕

</div>
