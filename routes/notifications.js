const express = require('express');
const { Notification } = require('../models');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET /api/notifications - user gets their notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications.', error: error.message });
  }
});

// PATCH /api/notifications/:id/read - mark as read
router.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const [updatedRows] = await Notification.update(
      { read: true },
      { where: { id: req.params.id, user_id: req.user.id } }
    );
    if (!updatedRows) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.json({ message: 'Marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read.', error: error.message });
  }
});

module.exports = router;
