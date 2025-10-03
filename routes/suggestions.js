// const express = require('express');
// const { Suggestion } = require('../models');
// const authenticateToken = require('../middleware/auth');
// const router = express.Router();

// // POST /api/suggestions — create a suggestion (protected)
// router.post('/suggestions', authenticateToken, async (req, res) => {
//   try {
//     const { content } = req.body;
//     const user_id = req.user.id;
//     if (!content) {
//       return res.status(400).json({ message: "Suggestion content is required." });
//     }
//     const suggestion = await Suggestion.create({ user_id, content });
//     res.status(201).json(suggestion);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create suggestion.", error: error.message });
//   }
// });

// // GET /api/suggestions — get all suggestions (public)
// router.get('/suggestions', async (req, res) => {
//   try {
//     const suggestions = await Suggestion.findAll();
//     res.json(suggestions);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch suggestions.", error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const { Suggestion } = require('../models');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// POST /api/suggestions — create a suggestion (citizen)
router.post('/suggestions', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const user_id = req.user.id;
    if (!title) {
      return res.status(400).json({ message: "Suggestion title is required." });
    }
    const suggestion = await Suggestion.create({ user_id, title, description, status: "open" });
    res.status(201).json(suggestion);
  } catch (error) {
    res.status(500).json({ message: "Failed to create suggestion.", error: error.message });
  }
});

// GET /api/suggestions/mine — citizen’s own suggestions
router.get('/suggestions/mine', authenticateToken, async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']] });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suggestions.", error: error.message });
  }
});

// GET /api/suggestions — all suggestions (official only)
router.get('/suggestions', authenticateToken, async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const suggestions = await Suggestion.findAll({ order: [['created_at', 'DESC']] });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suggestions.", error: error.message });
  }
});

// PATCH /api/suggestions/:id/status — update status by official
router.patch('/suggestions/:id/status', authenticateToken, async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }
    const suggestion = await Suggestion.findByPk(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found." });
    }
    suggestion.status = status;
    await suggestion.save();
    res.json({ message: "Suggestion status updated.", suggestion });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status.", error: error.message });
  }
});

module.exports = router;
