# 🎵 RaiVerse Music — MERN Stack Music Web Application

A production-ready music streaming web application built with **MongoDB, Express.js, React, and Node.js**. Features RBAC (Role-Based Access Control), audio compression, Base64 storage, and a premium glassmorphism dark UI.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure register/login with hashed passwords (bcryptjs) |
| **RBAC** | Admin uploads & deletes tracks; all users browse & play |
| **Audio Compression** | FFmpeg converts uploads to 128kbps MP3 |
| **Base64 Storage** | Compressed audio stored as Base64 in MongoDB |
| **Blob URL Playback** | Fast playback via browser Blob URLs (not data URIs) |
| **Client Cache** | Loaded tracks are cached in memory for instant replay |
| **Lazy Loading** | Audio data fetched only on play (not on library load) |
| **Search** | Full-text search with regex fallback |
| **Responsive UI** | Mobile-first glassmorphism design with Tailwind CSS |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Multer |
| **Database** | MongoDB (Atlas or Local) |
| **Audio** | FFmpeg (fluent-ffmpeg) for compression |

---

## 📁 Project Structure

```
RAISAVERSE/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile
│   │   └── musicController.js    # Upload, List, Search, Delete
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protect + adminOnly
│   │   └── errorMiddleware.js    # 404 + error handler
│   ├── models/
│   │   ├── User.js               # User schema with roles
│   │   └── Music.js              # Music schema with Base64 audio
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── musicRoutes.js
│   ├── utils/
│   │   ├── compressAudio.js      # FFmpeg compression
│   │   └── base64Converter.js    # Buffer ↔ Base64
│   ├── server.js                 # Express entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MusicCard.jsx     # Audio player + lazy loading
│   │   │   └── UploadForm.jsx    # Drag-drop upload
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Music library grid
│   │   │   ├── Upload.jsx        # Admin upload page
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/AuthContext.js # Auth state + RBAC
│   │   ├── services/
│   │   │   ├── api.js            # Axios instance
│   │   │   └── musicService.js   # Music API calls
│   │   ├── App.jsx               # Routes + guards
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind + design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** — [Atlas (cloud)](https://www.mongodb.com/atlas) or [local install](https://www.mongodb.com/docs/manual/installation/)
- **FFmpeg** (optional, for audio compression) — [Download](https://ffmpeg.org/download.html)

### 1. Clone & Configure

```bash
# Navigate to the project
cd RAISAVERSE

# Configure backend environment
# Edit backend/.env and set:
#   MONGODB_URI=mongodb+srv://your-atlas-uri  (or mongodb://localhost:27017/raisaverse-music)
#   JWT_SECRET=your-strong-secret-key
#   ADMIN_EMAIL=your-admin@email.com
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Open the App

Visit **http://localhost:5173** in your browser.

---

## 🔐 RBAC Setup

1. Set `ADMIN_EMAIL` in `backend/.env` to the email you want as admin
2. Register with that email — you'll automatically get the admin role
3. Any other email registers as a regular user

| Role | Can Upload | Can Delete | Can Browse | Can Play |
|------|-----------|-----------|-----------|---------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **User** | ❌ | ❌ | ✅ | ✅ |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/profile` | Protected | Get profile |

### Music
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/music` | Protected | List all tracks (no audio) |
| GET | `/api/music/search?q=` | Protected | Search tracks |
| GET | `/api/music/:id` | Protected | Get track with audio |
| POST | `/api/music/upload` | Admin | Upload track |
| DELETE | `/api/music/:id` | Admin | Delete track |

---

## 🎨 Design

- **Theme**: Dark mode with deep navy (#050810) gradients
- **Glass**: `backdrop-filter: blur(20px)` cards
- **Accents**: Cyan (#00d4ff) → Purple (#a855f7) → Magenta (#ff006e)
- **Font**: Inter (Google Fonts)
- **Animations**: Floating particles, waveform loader, bar visualizer, shimmer buttons

---

## 📝 Notes

- **6MB upload limit** — enforced at Multer and frontend
- **FFmpeg optional** — if not installed, audio passes through uncompressed
- **Base64 in MongoDB** — suitable for small-medium libraries. For large-scale, consider GridFS or S3
- **Blob URLs** — audio is converted from Base64 to Blob in the browser for efficient playback
