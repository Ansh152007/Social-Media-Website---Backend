# Social Media Sharing App (Backend) 🖼️

A full-stack social media sharing platform backend built with **Node.js**, **Express**, and **MongoDB**, supporting user authentication, image uploads via **Cloudinary**, and organization of pins and boards. This backend serves data to an EJS-rendered frontend or any frontend you may attach.

---

## ✨ Features

- 🔐 User Authentication (JWT + Middleware)
- 📌 Pin Creation, Fetching, and Deletion
- 🗂️ Board Management
- 🌍 Public User Profile Viewing
- ☁️ Cloudinary-based Image Upload & Cleanup
- ⚠️ Centralized Async Error Handling
- 🧪 Health Check Routes
- 🧱 Modular File Structure with MVC Design

---
```
📦 SOCIAL MEDIA WEBSITE - BACKEND
├── 📁 controllers
│   ├── healthcheck.controller.js
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
├── 📁 routes
│   └── health.check.route.js
├── 📁 utilities
│   ├── cloudinary.js
│   ├── genToken.js
│   └── multer.js
├── 📁 views
├── 📁 public
├── 📁 node_modules
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── app.js
├── app.route.js
├── server.js
├── package.json
├── package-lock.json
```

---

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Cloud Storage:** Cloudinary
- **File Uploads:** Multer
- **Authentication:** JWT
- **Templating (optional):** EJS
- **Environment Config:** dotenv

---

## 🌐 Core Routes

### Health Check
- `GET /api/health` – Server status check

### Auth / User
- `POST /api/user/register` – Register
- `POST /api/user/login` – Login
- `GET /api/user/profile/:id` – Public profile

### Pins
- `POST /api/pin/create` – Create a pin (with file upload)
- `GET /api/pin/:id` – Get pin by ID
- `DELETE /api/pin/:id` – Delete pin

### Boards
- `POST /api/board/create` – Create board
- `GET /api/board/:id` – Get board data

---

## ☁️ Image Upload Flow

1. Image is uploaded via `multer` to the `uploads/` temp folder.
2. Cloudinary receives the file via `cloudinary.uploader.upload()`.
3. File is deleted from local disk using `fs.unlinkSync()` after upload completes.

---

## 🧪 Environment Variables

Create a `.env` file like this:


# Server Configuration
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

# Database Configuration

DB_URL=


# JWT Secret (for token signing)

JWT_SECRET=your_jwt_secret_here


# Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Getting Started

```bash
# 1. Clone this repository
git clone https://github.com/your-username/social-media-backend

# 2. Navigate into the project
cd social-media-backend

# 3. Install dependencies
npm install

# 4. Create .env from the sample
cp .env.example .env

# 5. Run the server
npm run dev ```

```

📃 License
Licensed under the MIT License.


