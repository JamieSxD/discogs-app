const express = require('express');
const DiscogsService = require('../services/discogsService');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Verify Discogs token
router.post('/verify-token', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    const discogs = new DiscogsService(token);

    const profile = await discogs.getUserProfile();

    // Update user with Discogs info
    const user = await User.updateDiscogsToken(req.user.id, token, profile.username);

    res.json({
      message: 'Discogs account connected successfully',
      user,
      discogsProfile: profile
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid Discogs token' });
  }
});

// Get user collection
router.get('/collection', authMiddleware, async (req, res) => {
  try {
    if (!req.user.discogs_token) {
      return res.status(400).json({ error: 'Discogs account not connected' });
    }

    const discogs = new DiscogsService(req.user.discogs_token);
    const collection = await discogs.getUserCollection(req.user.discogs_username, req.query.page);

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Get user wantlist
router.get('/wantlist', authMiddleware, async (req, res) => {
  try {
    if (!req.user.discogs_token) {
      return res.status(400).json({ error: 'Discogs account not connected' });
    }

    const discogs = new DiscogsService(req.user.discogs_token);
    const wantlist = await discogs.getUserWantlist(req.user.discogs_username, req.query.page);

    res.json(wantlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wantlist' });
  }
});

// Get marketplace listings for a release
router.get('/marketplace/:releaseId', authMiddleware, async (req, res) => {
  try {
    if (!req.user.discogs_token) {
      return res.status(400).json({ error: 'Discogs account not connected' });
    }

    const discogs = new DiscogsService(req.user.discogs_token);
    const listings = await discogs.getReleaseMarketplace(req.params.releaseId);

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace data' });
  }
});

module.exports = router;