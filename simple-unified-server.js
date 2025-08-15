import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3000;

// MongoDB connection
let db;
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    db = client.db('eic-pathfinder');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

// Helper functions
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

// Helper function to get request body
async function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
  });
}

// Helper function to get content type
function getContentType(ext) {
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}

// API handlers
async function handleSendVerification(req, res) {
  try {
    const body = await getRequestBody(req);
    const { email } = JSON.parse(body);
    
    if (!email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email is required' }));
      return;
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store verification code
    const verificationCodes = db.collection('verificationCodes');
    await verificationCodes.updateOne(
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

    // Log code to console for development
    console.log(`🔐 Verification code for ${email}: ${verificationCode}`);
    console.log(`📧 In production, this would be sent to: ${email}`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `Verification code generated: ${verificationCode} (Check console for development)`
    }));
  } catch (error) {
    console.error('Send verification error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to send verification code' }));
  }
}

async function handleVerifyCode(req, res) {
  try {
    const body = await getRequestBody(req);
    const { email, code } = JSON.parse(body);

    const verificationCodes = db.collection('verificationCodes');
    const verificationRecord = await verificationCodes.findOne({ email });

    if (!verificationRecord) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'No verification code found for this email'
      }));
      return;
    }

    // Check if code is expired
    if (new Date() > verificationRecord.expiresAt) {
      await verificationCodes.deleteOne({ email });
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      }));
      return;
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
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Too many failed attempts. Please request a new verification code.'
        }));
        return;
      }

      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Invalid verification code'
      }));
      return;
    }

    // Code is valid - mark email as verified
    await verificationCodes.updateOne(
      { email },
      { $set: { verified: true, verifiedAt: new Date() } }
    );

    console.log(`✅ Email ${email} verified successfully with code ${code}`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Email verified successfully'
    }));
  } catch (error) {
    console.error('Verify code error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to verify code' }));
  }
}

async function handleRegister(req, res) {
  try {
    const body = await getRequestBody(req);
    const { email, password, firstName, lastName, studentId, verificationCode } = JSON.parse(body);

    // Validation
    if (!email || !password || !firstName || !lastName || !studentId || !verificationCode) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'All fields are required' }));
      return;
    }

    if (password.length < 8) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Password must be at least 8 characters long' }));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid email format' }));
      return;
    }

    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = email.split('@')[1];
    if (!validDomains.includes(emailDomain)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please use your Bowie State University email address' }));
      return;
    }

    // Verify email verification code
    const verificationCodes = db.collection('verificationCodes');
    const verificationRecord = await verificationCodes.findOne({ email, verified: true });

    if (!verificationRecord) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email not verified. Please verify your email first.' }));
      return;
    }

    // Check if verification is still valid (within 1 hour)
    const verificationAge = new Date() - verificationRecord.verifiedAt;
    if (verificationAge > 60 * 60 * 1000) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email verification expired. Please verify your email again.' }));
      return;
    }

    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User with this email already exists' }));
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      email,
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentId: studentId.trim(),
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

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'User created successfully',
      user: createdUser,
    }));
  } catch (error) {
    console.error('Registration error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

async function handleLogin(req, res) {
  try {
    const body = await getRequestBody(req);
    const { email, password } = JSON.parse(body);

    if (!email || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email and password are required' }));
      return;
    }

    const users = db.collection('users');
    const user = await users.findOne({ email });

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Store refresh token in database
    await users.updateOne(
      { _id: user._id },
      { $set: { refreshToken } }
    );

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Login successful',
      user: userResponse,
      accessToken,
      refreshToken
    }));
  } catch (error) {
    console.error('Login error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

async function handleVerifyEmail(req, res) {
  try {
    const body = await getRequestBody(req);
    const { email } = JSON.parse(body);

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        isValid: false,
        message: 'Invalid email format'
      }));
      return;
    }

    // Check if email is from a valid Bowie State domain
    const validDomains = ['bowiestate.edu', 'students.bowiestate.edu'];
    const emailDomain = email.split('@')[1];
    
    if (!validDomains.includes(emailDomain)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        isValid: false,
        message: 'Please use your Bowie State University email address'
      }));
      return;
    }

    // Check if email already exists
    const users = db.collection('users');
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        isValid: false,
        message: 'Email already registered'
      }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      isValid: true,
      message: 'Email is valid and available'
    }));
  } catch (error) {
    console.error('Email verification error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API requests
  if (req.url.startsWith('/api/auth/')) {
    const endpoint = req.url.replace('/api/auth/', '');
    
    switch (endpoint) {
      case 'send-verification':
        if (req.method === 'POST') {
          await handleSendVerification(req, res);
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
        
      case 'verify-code':
        if (req.method === 'POST') {
          await handleVerifyCode(req, res);
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
        
      case 'register':
        if (req.method === 'POST') {
          await handleRegister(req, res);
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
        
      case 'login':
        if (req.method === 'POST') {
          await handleLogin(req, res);
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
        
      case 'verify-email':
        if (req.method === 'POST') {
          await handleVerifyEmail(req, res);
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
        
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
    return;
  }

  // Handle static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'dist', filePath);
  
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    // If file not found, serve index.html for SPA routing
    try {
      const indexContent = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexContent);
    } catch (indexError) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

// Start server
const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`🚀 Simple unified server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 Backend API: http://localhost:${PORT}/api`);
    console.log(`🌐 For public access, expose port ${PORT} with ngrok`);
  });
};

startServer().catch(console.error);
