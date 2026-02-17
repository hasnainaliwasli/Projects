# 🏠 Hostel Finder

Welcome to **Hostel Finder**, a modern, full-stack web application designed to simplify the process of finding and booking the perfect hostel. Whether you're a student, a traveler, or someone looking for a new place to stay, Hostel Finder provides a seamless, interactive experience.

---

## ✨ Features

### 🔐 Secure Authentication
- **User Accounts**: Easy registration and login for both seekers and managers.
- **Role-Based Access**: Specialized dashboards for users and administrators.
- **Password Recovery**: Secure forgot/reset password flow using Nodemailer.

### 🏠 Comprehensive Listings
- **Advanced Filtering**: Search for hostels by location, price range, and amenities.
- **Detailed Profiles**: Each hostel features high-quality images, descriptions, and user reviews.
- **Review System**: Share your experience and read feedback from other residents.

### 🗺️ Interactive Exploration
- **Map View**: Fully integrated [Leaflet](https://leafletjs.org/) maps to visualize hostel locations in real-time.
- **Location Pinning**: Easily find exactly where your next home is located.

### 💬 Real-time Connectivity
- **Instant Messaging**: Connect with hostel owners or managers directly via a built-in chat system powered by **Socket.io**.
- **Typing Indicators**: See when someone is replying to your message.
- **Real-time Notifications**: Get instant alerts for new messages, booking updates, and more.

### 🖼️ Modern Image Handling
- **Cloud Integration**: Seamless image uploads and management using **Cloudinary**.
- **Responsive Media**: Effortlessly view hostel images on any device.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Maps**: [Leaflet](https://leafletjs.org/) & [React Leaflet](https://react-leaflet.js.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **Real-time**: [Socket.io](https://socket.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB account (Atlas or local)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hostel-finder.git
cd hostel-finder
```

### 2. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` folder and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
Hostel_Finder/
├── Backend/          # Node.js/Express API, Socket.io, Mongoose Models
│   ├── config/       # Database & Cloudinary config
│   ├── controllers/  # Route handlers logic
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   └── server.js     # Entry point
└── Frontend/         # Next.js Application
    ├── app/          # App Router pages and layouts
    ├── components/   # Reusable UI components
    ├── lib/          # State management (Redux) & utilities
    └── public/       # Static assets
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

Designed and Developed by [Hasnain Ali Wasli](https://github.com/hasnainaliwasli) 🚀
