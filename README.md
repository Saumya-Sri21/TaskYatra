# 📝 TaskYatra – Full Stack Task Management App

A full-stack web application built for efficient task management using **React (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 🔑 Admin Registration Note
To register as an **Admin**, you must enter a **secret token** during registration.  
**Here, the secret token is:** `21112002`

---

## 🔗 Live URL
👉 [Live Link](https://taskyatra.onrender.com)

---

## 📬 Postman Collection
👉 [**Test all API endpoints here**](https://web-dev-8174.postman.co/workspace/Saumya's-Workspace~81bab76d-08ac-438b-a79c-633ba98e50f4/collection/34752140-e404910f-3ddc-494a-a74f-cce114de2ec2?action=share&source=copy-link&creator=34752140&active-environment=246d6e22-6c65-4ac7-8fbb-81c465ce7cc4)

---

## 🚀 Features
- 🔐 JWT Authentication (Register/Login)
- 👤 Admin & User Roles (Admin token required for admin signup)
- 📋 CRUD for Tasks
- 🎯 Responsive UI using Tailwind CSS
- 🌐 RESTful API with Express
- ⚙️ MongoDB for database
- 📥 File uploads stored locally
- 🧪 Postman-tested endpoints (automated tests in progress)

---

## ⚙️ Installation & Setup  
```bash
git clone https://github.com/your-username/taskyatra.git
cd taskyatra

cd server
npm install
npm run dev

cd ../client
npm install
npm run dev
