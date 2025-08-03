# Social Media Sharing App (Backend) 🖼️

A full-stack social media sharing platform backend built with **Node.js**, **Express**, and **MongoDB**, supporting user authentication, image uploads via **Cloudinary**, and organization of pins and boards. This backend serves data to an EJS-rendered frontend or any frontend you may attach.

---

## ✨ Features

- 🔐 **User Authentication** (JWT + Middleware + Cookie-based)
- 📌 **Pin Management** (Create, View, Delete with Image Upload)
- 🗂️ **Board Management** (Create, Update, Delete, Pin Organization)
- 🌍 **Public User Profiles** & User Discovery
- ☁️ **Cloudinary Integration** (Image Upload & Auto-cleanup)
- 🎨 **Modern EJS Frontend** with Responsive Design
- ⚡ **Real-time Validation** & Interactive UI
- 🛡️ **Security Features** (Helmet, Rate Limiting, CORS, Sanitization)
- ⚠️ **Centralized Error Handling** & Async Middleware
- 🧪 **Health Check Monitoring**
- 📱 **Mobile-Responsive Design** with Modern UI/UX
- 🧱 **Modular MVC Architecture**

---
```
📦 SOCIAL MEDIA WEBSITE - BACKEND
├── 📁 controllers
│   ├── board.controller.js
│   ├── healthcheck.controller.js
│   ├── pin.controller.js
│   └── user.controller.js
├── 📁 database
│   └── connectDB.js
├── 📁 middleware
│   ├── asyncanderrorhandler.middleware.js
│   └── auth.middleware.js
├── 📁 models
│   ├── board.model.js
│   ├── pins.model.js
│   └── user.model.js
├── 📁 public
│   ├── 📁 css
│   │   └── style.css
│   └── 📁 js
│       └── main.js
├── 📁 routes
│   ├── board.route.js
│   ├── health.check.route.js
│   ├── pin.route.js
│   ├── user.route.js
│   └── views.route.js
├── 📁 uploads
├── 📁 utilities
│   ├── cloudinary.js
│   ├── genToken.js
│   └── multer.js
├── 📁 views
│   ├── dashboard.ejs
│   ├── home.ejs
│   ├── layout.ejs
│   ├── login.ejs
│   └── register.ejs
├── 📁 node_modules
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── app.js
├── app.route.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## ⚙️ Tech Stack

- **Runtime:** Node.js (ES6 Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Cloud Storage:** Cloudinary
- **File Uploads:** Multer
- **Authentication:** JWT with Cookie-based Storage
- **Password Hashing:** bcryptjs
- **Templating:** EJS with Modern CSS/JS
- **Environment Config:** dotenv
- **Security:** Helmet, CORS, Rate Limiting, MongoDB Sanitization
- **Development:** Node --watch for hot reloading
- **Logging:** Morgan middleware

---

## 🌐 Core Routes

### Health Check
- `GET /api/healthstatus/health` – Server status check

### Auth / User Routes
- `POST /api/user/register` – Register new user (with avatar upload)
- `POST /api/user/login` – User login
- `POST /api/user/logout` – User logout (authenticated)
- `GET /api/user/me` – Get current user profile (authenticated)
- `GET /api/user/profile/:userId` – Get user profile by ID (public)
- `PUT /api/user/profile` – Update user profile (authenticated, with avatar upload)

### Pin Routes
- `POST /api/pin/` – Create a new pin (authenticated)
- `GET /api/pin/` – Get all pins (explore page)
- `DELETE /api/pin/:pinId` – Delete a pin (authenticated)

### Board Routes
**Public Routes:**
- `GET /api/board/explore` – Explore all public boards
- `GET /api/board/:boardId` – Get board by ID

**Protected Routes (Authentication Required):**
- `POST /api/board/` – Create a new board
- `GET /api/board/user/boards` – Get current user's boards
- `PUT /api/board/:boardId` – Update board details
- `DELETE /api/board/:boardId` – Delete a board
- `POST /api/board/:boardId/pins` – Add pin to board
- `DELETE /api/board/:boardId/pins/:pinId` – Remove pin from board

### View Routes (EJS Frontend)
- `GET /` – Home page
- `GET /register` – Registration page
- `GET /login` – Login page
- `GET /dashboard` – User dashboard (authenticated)
- `GET /logout` – Logout and redirect

---

## ☁️ Image Upload Flow

1. Image is uploaded via `multer` to the `uploads/` temp folder.
2. Cloudinary receives the file via `cloudinary.uploader.upload()`.
3. File is deleted from local disk using `fs.unlinkSync()` after upload completes.

---

## 🧪 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT = 8000
NODE_ENV = development
CLIENT_URL = *

# Database Configuration (MongoDB Atlas or Local)
DB_URL = mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret (Generate a secure random string)
JWT_SECRET = your_super_secure_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

> **Note:** You can copy `.env.example` to `.env` and fill in your actual values.

---

## 🚀 Getting Started

```bash
# 1. Clone this repository
git clone https://github.com/Ansh152007/Social-Media-Website---Backend.git

# 2. Navigate into the project
cd Social-Media-Website---Backend

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env
# Edit .env file with your actual values

# 5. Start the development server
npm run dev

# 6. Start the production server
npm start
```

The server will start on `http://localhost:8000`

### 📱 Available Views
- **Home Page:** `http://localhost:8000/`
- **Register:** `http://localhost:8000/register`
- **Login:** `http://localhost:8000/login`
- **Dashboard:** `http://localhost:8000/dashboard` (requires login)

### 🔧 API Base URL
All API routes are prefixed with `/api/`
- Example: `http://localhost:8000/api/user/register`

---

## 📁 Project Structure Highlights

- **MVC Architecture:** Clean separation of concerns
- **Middleware:** Authentication, error handling, and security
- **Controllers:** Business logic for users, pins, and boards
- **Models:** MongoDB schemas with Mongoose
- **Routes:** RESTful API endpoints and view routes
- **Views:** EJS templates with modern responsive design
- **Public:** Static assets (CSS, JavaScript, images)
- **Utilities:** Helper functions for file upload and token generation

---

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **MongoDB Sanitization** to prevent injection attacks
- **Input Validation** and error handling

---

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

---

## 👨‍💻 Author

**Ansh Tiwari**
- GitHub: [@Ansh152007](https://github.com/Ansh152007)

---



