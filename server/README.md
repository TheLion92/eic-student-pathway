# EIC Pathway Server

Backend server for the EIC Student Pathway application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory with:
```
MONGODB_URI=mongodb://localhost:27017
PORT=5000
NODE_ENV=development
```

### 3. MongoDB Setup
Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance.

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on http://localhost:5000

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/:userId/progress` - Update user progress
- `PUT /api/user/:userId/assessment` - Update assessment level

## Database Schema

The application uses MongoDB with the following collections:
- `users` - User accounts and progress tracking
