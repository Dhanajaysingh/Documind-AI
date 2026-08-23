# DocuMind-AI

### AI-powered code documentation generator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-DocuMind%20AI-20c9b0?style=for-the-badge)](https://documind-ai-beta-sand.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Dhanajaysingh/Documind-AI)

> Turn any code archive into polished project documentation.

DocuMind AI is a full-stack AI-powered developer tool that analyzes an uploaded codebase and generates structured Markdown documentation automatically.

Instead of manually understanding an unfamiliar repository and writing documentation from scratch, developers can upload a project archive and let DocuMind AI analyze the code and produce clear, reusable documentation.

---

## 🚀 Live Demo

**Try DocuMind AI:**  
https://documind-ai-beta-sand.vercel.app/

---

## 📸 Preview

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="DocuMind AI Dashboard" width="900"/>
</p>

---

## ✨ Features

### 📦 Codebase Upload

Upload a complete project as a `.zip` archive through a simple web interface.

### 🔍 Intelligent Code Scanning

The backend extracts and scans the uploaded project while filtering unnecessary files and directories.

### 🤖 AI-Powered Documentation

Gemini analyzes the project and generates structured Markdown documentation based on the codebase.

### 🔐 Authentication

User registration and login are protected using:

- JWT authentication
- Password hashing with bcrypt
- Protected API routes

### 💾 Persistent Storage

User accounts and generated documentation are stored in MongoDB Atlas using Mongoose.

### 📚 Documentation History

Previously generated documentation is saved and displayed in the user's dashboard.

### 📄 Markdown Output

Generated documentation is stored as Markdown and can be viewed and downloaded.

### ☁️ Cloud Deployment

The application is deployed using Vercel with MongoDB Atlas as the persistent database.

---

## 🧠 How It Works

```text
                    ┌─────────────────┐
                    │   User Uploads  │
                    │   Project .zip  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Upload API      │
                    │ Express + Multer│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Archive         │
                    │ Extraction      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Code Scanner    │
                    │ & File Filtering│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Gemini AI       │
                    │ Code Analysis   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Markdown Docs   │
                    │ Generation      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ MongoDB Atlas   │
                    │ Document Store  │
                    └─────────────────┘
🛠️ Tech Stack
Frontend
React
Vite
CSS
JavaScript
Backend
Node.js
Express
Multer
JWT
bcryptjs
AI
Google Gemini API
@google/genai
Database
MongoDB Atlas
Mongoose
Deployment
Vercel
MongoDB Atlas
