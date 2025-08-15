const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'eic-pathfinder';

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Connect to database on startup
connectToDatabase();

// Email verification functions
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isVerificationCodeExpired(createdAt) {
  const now = new Date();
  const codeAge = now - new Date(createdAt);
  return codeAge > 60 * 60 * 1000; // 1 hour expiration (matching registration check)
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

// Email transporter (you'll need to configure this)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Generate JWT tokens
function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: 'Too many registration attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const emailLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 email verification requests per 5 minutes
  message: 'Too many email verification requests, please wait before trying again',
  standardHeaders: true,
  legacyHeaders: false,
});

// Account lockout tracking
const failedAttempts = new Map();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

function isAccountLocked(email) {
  const attempts = failedAttempts.get(email);
  if (!attempts) return false;
  
  if (attempts.count >= LOCKOUT_THRESHOLD) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_DURATION) {
      return true;
    } else {
      // Reset lockout after duration
      failedAttempts.delete(email);
      return false;
    }
  }
  return false;
}

function recordFailedAttempt(email) {
  const attempts = failedAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  failedAttempts.set(email, attempts);
}

function recordSuccessfulAttempt(email) {
  failedAttempts.delete(email);
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EIC Pathway API is running' });
});

// Send verification code endpoint
app.post('/api/auth/send-verification', emailLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Check if email is from a valid Bowie State domain
    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = email.split('@')[1];
    
    if (!validDomains.includes(emailDomain)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please use your Bowie State University email address (@bowiestate.edu or @students.bowiestate.edu)' 
      });
    }

    // Check if email already exists
    const users = db.collection('users');
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store verification code in database
    const verificationCodes = db.collection('verificationCodes');
    const storageResult = await verificationCodes.updateOne(
      { email },
      { 
        $set: { 
          code: verificationCode, 
          expiresAt,
          attempts: 0
        } 
      },
      { upsert: true }
    );

    console.log(`💾 Verification code storage result:`, storageResult);
    
    // Verify the code was stored
    const storedCode = await verificationCodes.findOne({ email });
    console.log(`🔍 Stored verification code:`, { email, code: storedCode?.code, expiresAt: storedCode?.expiresAt });

    // TEMPORARY: Log code to console instead of sending email
    console.log(`🔐 Verification code for ${email}: ${verificationCode}`);
    console.log(`📧 In production, this would be sent to: ${email}`);

    res.json({ 
      success: true, 
      message: `Verification code generated: ${verificationCode} (Check console for development)` 
    });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify code endpoint
app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const verificationCodes = db.collection('verificationCodes');
    const verificationRecord = await verificationCodes.findOne({ email });

    if (!verificationRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'No verification code found for this email' 
      });
    }

    // Check if code is expired
    if (isVerificationCodeExpired(verificationRecord.expiresAt)) {
      await verificationCodes.deleteOne({ email });
      return res.status(400).json({ 
        success: false, 
        message: 'Verification code has expired. Please request a new one.' 
      });
    }

    // Check if code matches
    if (verificationRecord.code !== code) {
      // Increment attempts
      await verificationCodes.updateOne(
        { email },
        { $inc: { attempts: 1 } }
      );

      if (verificationRecord.attempts >= 2) {
        await verificationCodes.deleteOne({ email });
        return res.status(400).json({ 
          success: false, 
          message: 'Too many failed attempts. Please request a new verification code.' 
        });
      }

      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code' 
      });
    }

    // Code is valid - mark email as verified
    const updateResult = await verificationCodes.updateOne(
      { email },
      { $set: { verified: true, verifiedAt: new Date() } }
    );

    console.log(`✅ Email ${email} verified successfully with code ${code}`);
    console.log(`📝 Update result:`, updateResult);
    
    // Verify the update was successful
    const updatedRecord = await verificationCodes.findOne({ email });
    console.log(`🔍 Updated record:`, { email, verified: updatedRecord?.verified, verifiedAt: updatedRecord?.verifiedAt });

    res.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// Email verification endpoint (now just checks domain and availability)
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        isValid: false, 
        message: 'Invalid email format' 
      });
    }

    // Check if email is from a valid Bowie State domain
    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = email.split('@')[1];
    
    if (!validDomains.includes(emailDomain)) {
      return res.status(400).json({ 
        isValid: false, 
        message: 'Please use your Bowie State University email address (@bowiestate.edu or @students.bowiestate.edu)' 
      });
    }

    // Check if email already exists
    const users = db.collection('users');
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        isValid: false, 
        message: 'Email already registered' 
      });
    }

    res.json({ 
      isValid: true, 
      message: 'Email is valid and available' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration
app.post('/api/auth/register', registerLimiter, async (req, res) => {
  try {
    const { email, password, firstName, lastName, studentId, verificationCode } = req.body;

    // Debug logging
    console.log('Registration attempt:', { email, firstName, lastName, studentId, hasVerificationCode: !!verificationCode });

    // Validation
    if (!email || !password || !firstName || !lastName || !studentId || !verificationCode) {
      console.log('Missing fields:', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName, studentId: !!studentId, verificationCode: !!verificationCode });
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Student ID validation - should be alphanumeric and reasonable length
    if (!studentId || typeof studentId !== 'string' || studentId.trim().length < 3 || studentId.trim().length > 20) {
      return res.status(400).json({ error: 'Student ID must be between 3 and 20 characters long' });
    }

    // Trim whitespace from text fields
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedStudentId = studentId.trim();

    if (trimmedFirstName.length < 2 || trimmedLastName.length < 2) {
      return res.status(400).json({ error: 'First and last names must be at least 2 characters long' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = email.split('@')[1];
    if (!validDomains.includes(emailDomain)) {
      return res.status(400).json({ error: 'Please use your Bowie State University email address (@bowiestate.edu or @students.bowiestate.edu)' });
    }

    // Verify email verification code
    if (!verificationCode || typeof verificationCode !== 'string' || verificationCode.trim().length !== 6) {
      return res.status(400).json({ error: 'Verification code must be exactly 6 digits' });
    }

    const verificationCodes = db.collection('verificationCodes');
    const verificationRecord = await verificationCodes.findOne({ email, verified: true });

    console.log('Verification check:', { 
      email, 
      verificationCode: verificationCode.trim(), 
      foundRecord: !!verificationRecord,
      recordDetails: verificationRecord ? { verified: verificationRecord.verified, verifiedAt: verificationRecord.verifiedAt } : null
    });

    if (!verificationRecord) {
      return res.status(400).json({ error: 'Email not verified. Please verify your email first.' });
    }

    // Check if verification is still valid (within 1 hour)
    const verificationAge = new Date() - verificationRecord.verifiedAt;
    if (verificationAge > 60 * 60 * 1000) { // 1 hour
      return res.status(400).json({ error: 'Email verification expired. Please verify your email again.' });
    }

    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      email,
      password: hashedPassword,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      studentId: trimmedStudentId,
      createdAt: new Date(),
      currentPhase: 1,
      progress: {
        completed: [],
        unlocked: [1],
      },
    };

    const result = await users.insertOne(newUser);
    const createdUser = { ...newUser, _id: result.insertedId };

    // Remove password from response
    delete createdUser.password;

    // Clean up verification code
    await verificationCodes.deleteOne({ email });

    res.status(201).json({
      message: 'User created successfully',
      user: createdUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if account is locked
    if (isAccountLocked(email)) {
      return res.status(423).json({ 
        error: 'Account temporarily locked due to too many failed attempts. Please try again in 30 minutes.' 
      });
    }

    const users = db.collection('users');

    // Find user by email
    const user = await users.findOne({ email });
    if (!user) {
      recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Successful login - clear failed attempts
    recordSuccessfulAttempt(email);

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Store refresh token in database
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLogin: new Date(),
          refreshToken: refreshToken
        } 
      }
    );

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json({
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const users = db.collection('users');
      const user = await users.findOne({ 
        _id: decoded.userId, 
        refreshToken: refreshToken 
      });

      if (!user) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());

      // Update refresh token in database
      await users.updateOne(
        { _id: user._id },
        { $set: { refreshToken: newRefreshToken } }
      );

      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile (now protected with JWT)
app.get('/api/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure user can only access their own profile
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = db.collection('users');
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user progress
app.put('/api/user/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params;
    const { progress } = req.body;

    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: userId },
      { $set: { progress } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update assessment level
app.put('/api/user/:userId/assessment', async (req, res) => {
  try {
    const { userId } = req.params;
    const { assessmentLevel } = req.body;

    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: userId },
      { $set: { assessmentLevel } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Assessment level updated successfully' });
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update current phase
app.put('/api/user/:userId/phase', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPhase } = req.body;

    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: userId },
      { $set: { currentPhase } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Current phase updated successfully' });
  } catch (error) {
    console.error('Update phase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
