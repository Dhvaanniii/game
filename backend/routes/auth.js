const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Configure nodemailer (development: ethereal)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'projectmail0616@gmail.com',
    pass: 'buxynthszlhkrbpi' // <-- No spaces!
  },
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if user already exists
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create new user
    const user = await User.create(req.body);
    
    // Generate JWT token (sessionId logic removed)
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    // Accept either 'username' or 'email' as 'identifier'
    const identifier = req.body.username || req.body.email || req.body.identifier;
    const { password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }
    // Find user by username or email
    const user = await User.findByUsernameOrEmail(identifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Validate password
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Update last login
    await User.updateLastLogin(user.userId);
    // Generate JWT token (sessionId logic removed)
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token,
      userType: (user.userType || 'user').trim()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    await User.updateProfile(req.userId, req.body);
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add coins
router.post('/coins', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    await User.updateCoins(req.userId, amount);
    res.json({ success: true, message: 'Coins updated successfully' });
  } catch (error) {
    console.error('Update coins error:', error);
    res.status(500).json({ error: 'Failed to update coins' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ error: 'No user with that email' });
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    // Store token and expiry in user (for demo, add to user record)
    await User.updateProfile(user.userId, { resetToken: token, resetTokenExpiry: tokenExpiry });
    // Send email
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`; // Use your frontend URL and port here
    await transporter.sendMail({
      from: 'projectmail0616@gmail.com', // <-- SENDER EMAIL
      to: user.email,
      subject: 'Password Reset Request',
      text: `Hello ${user.username},\n\nYou requested a password reset. Click here: ${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>Hello <strong>${user.username}</strong>,</p><p>You requested a password reset.</p><p><a href=\"${resetUrl}\">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`,
    });
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err); // <--- This will show the real error in your terminal
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password required' });
  try {
    // Find user by token
    const params = {
      TableName: require('../config/dynamodb').TABLES.USERS,
      FilterExpression: 'resetToken = :token AND resetTokenExpiry >= :now',
      ExpressionAttributeValues: { ':token': token, ':now': Date.now() },
    };
    const result = await require('../config/dynamodb').docClient.scan(params).promise();
    const user = result.Items[0];
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    // Hash new password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update password and remove token
    await User.updateProfile(user.userId, { password: hashedPassword, resetToken: null, resetTokenExpiry: null });
    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    // Get user
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    // Check old password
    const isMatch = await User.validatePassword(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect.' });
    // Validate new password requirements (same as registration)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: 'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }
    // Check new and confirm match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match.' });
    }
    // Hash and update
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateProfile(req.userId, { password: hashedPassword });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    // sessionId check removed: single-session logic no longer used
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or logged in elsewhere' });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = router;