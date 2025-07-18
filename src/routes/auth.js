const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const { validateBody, schemas } = require('../middleware/validation');
const UserService = require('../services/userService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', validateBody(schemas.register), async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({ email, password, firstName, lastName });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', validateBody(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
      message: 'Login successful',
      token,
      user: User.sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// Connect Discogs account
router.post('/connect-discogs',
  authMiddleware,
  validateBody(schemas.connectDiscogs),
  async (req, res) => {
    try {
      const { token } = req.body;

      // TODO: Verify token with Discogs API
      // For now, we'll just store it
      const user = await User.updateDiscogsToken(req.user.id, token, 'username');

      res.json({
        message: 'Discogs account connected successfully',
        user
      });
    } catch (error) {
      console.error('Discogs connection error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await UserService.uploadAvatar(req.file, req.user.id);

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: result
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Delete avatar
router.delete('/avatar', authMiddleware, async (req, res) => {
  try {
    await UserService.deleteAvatar(req.user.id);
    res.json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

module.exports = router;