# EIC Student Pathway - Setup Guide

## 🚀 Quick Start

This project now has a proper authentication system with MongoDB backend and React frontend.

## 📋 Prerequisites

1. **Node.js** (v16 or higher) - ✅ Already installed
2. **MongoDB** - You need to install this
3. **Git** - ✅ Already available

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB (Recommended for development)
```bash
# On macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update the server `.env` file

## 🔧 Project Setup

### 1. Frontend (React App)
```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```
Frontend will run on: http://localhost:8080

### 2. Backend (Express Server)
```bash
# Navigate to server directory
cd server

# Install dependencies (already done)
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start server
npm run dev
```
Backend will run on: http://localhost:5000

## 🌐 Environment Variables

### Frontend (.env in root)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
MONGODB_URI=mongodb://localhost:27017
PORT=5000
NODE_ENV=development
```

## 🎯 What We've Built

### ✅ Authentication System
- User registration with email/password
- Secure login system
- Password hashing with bcrypt
- MongoDB user storage

### ✅ Frontend Features
- Modern login/register forms
- Tabbed interface for switching between modes
- Form validation and error handling
- Loading states and user feedback

### ✅ Backend API
- RESTful endpoints for auth operations
- MongoDB integration
- CORS enabled for frontend communication
- Error handling and validation

## 🚦 Running the Project

### Terminal 1: Frontend
```bash
npm run dev
```

### Terminal 2: Backend
```bash
cd server
npm run dev
```

### Terminal 3: MongoDB (if local)
```bash
# MongoDB should be running as a service
# Check status: brew services list | grep mongodb
```

## 🧪 Testing the System

1. **Open** http://localhost:8080
2. **Click** "Get Started" on the home page
3. **Create** a new account or sign in
4. **Verify** the authentication works

## 🔍 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list | grep mongodb`
- Check connection string in server/.env
- Verify MongoDB port (default: 27017)

### Port Conflicts
- Frontend: Change port in vite.config.ts
- Backend: Change PORT in server/.env

### CORS Issues
- Backend has CORS enabled for localhost
- Check that frontend URL matches backend CORS settings

## 📚 Next Steps

Once this is working, we can:
1. **Integrate the level assessment system** into Phase 2
2. **Build the resource management system**
3. **Implement progress tracking**
4. **Add gamification features**

## 🆘 Need Help?

Check the server logs for backend errors and browser console for frontend issues. The system is designed to provide clear error messages for common problems.
