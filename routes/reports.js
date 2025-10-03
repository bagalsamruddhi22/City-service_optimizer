const express = require('express');
const { Notification, Report } = require('../models');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// POST /api/reports (protected, with validation)
router.post(
  '/reports',
  authenticateToken,
  [
    body('type').notEmpty().withMessage('Report type is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location_lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
    body('location_lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
  ],
  async (req, res) => {
    // Validation handler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { type, description, image_url, location_lat, location_lng } = req.body;
      const user_id = req.user.id;

      const report = await Report.create({
        user_id,
        type,
        description,
        image_url,
        location: { type: 'Point', coordinates: [location_lng, location_lat] },
        status: 'open',
      });

      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create report', error: error.message });
    }
  }
);

// GET /api/reports (public)
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
});

// PATCH /api/reports/:id/status (officials only)
router.patch(
  '/reports/:id/status',
  authenticateToken,
  requireRole('official'),
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['open', 'in_progress', 'resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value." });
      }
      const report = await Report.findByPk(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found." });
      }
      report.status = status;
      await report.save();

      await Notification.create({
        user_id: report.user_id,
        message: `Your report #${report.id} status changed to ${report.status}.`
      });


      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to update report status.", error: error.message });
    }
  }
);

// GET /api/reports/mine (protected - logged-in user's own reports)
router.get('/reports/mine', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your reports', error: error.message });
  }
});


module.exports = router;
