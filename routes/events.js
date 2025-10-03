const express = require('express');
const { Event } = require('../models');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/role'); // <= import here

const router = express.Router();

// POST /api/events (officials only)
router.post('/events', authenticateToken, requireRole('official'), async (req, res) => {
  try {
    const { name, description, start_time, end_time, location_lat, location_lng } = req.body;
    if (!name || !start_time || !location_lat || !location_lng) {
      return res.status(400).json({ message: 'Name, start_time, and location are required.' });
    }
    const created_by = req.user.id;
    const event = await Event.create({
      name,
      description,
      start_time,
      end_time,
      location: { type: 'Point', coordinates: [location_lng, location_lat] },
      created_by
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event.', error: error.message });
  }
});

// GET /api/events (public)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.', error: error.message });
  }
});

module.exports = router;
