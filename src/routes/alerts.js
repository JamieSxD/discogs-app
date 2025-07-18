const express = require('express');
const PriceAlert = require('../models/PriceAlert');
const authMiddleware = require('../middleware/auth');
const { validateBody, schemas } = require('../middleware/validation');

const router = express.Router();

// Get user's alerts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const alerts = await PriceAlert.findByUserId(req.user.id, limit, offset);
    const total = await PriceAlert.countByUserId(req.user.id);

    res.json({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create alert
router.post('/',
  authMiddleware,
  validateBody(schemas.createAlert),
  async (req, res) => {
    try {
      // Check if user has reached their alert limit
      const alertCount = await PriceAlert.countByUserId(req.user.id);
      if (req.user.alert_limit !== -1 && alertCount >= req.user.alert_limit) {
        return res.status(400).json({
          error: 'Alert limit reached. Please upgrade your subscription.'
        });
      }

      const alertData = {
        userId: req.user.id,
        ...req.body
      };

      const alert = await PriceAlert.create(alertData);

      res.status(201).json({
        message: 'Price alert created successfully',
        alert
      });
    } catch (error) {
      console.error('Create alert error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Toggle alert active status
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);

    if (!alert || alert.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const updatedAlert = await PriceAlert.toggleActive(req.params.id, !alert.is_active);

    res.json({
      message: `Alert ${updatedAlert.is_active ? 'activated' : 'deactivated'}`,
      alert: updatedAlert
    });
  } catch (error) {
    console.error('Toggle alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete alert
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);

    if (!alert || alert.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await PriceAlert.delete(req.params.id);

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;