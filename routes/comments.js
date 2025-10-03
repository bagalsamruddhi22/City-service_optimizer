const express = require('express');
const { Comment } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// POST /api/comments (protected)
router.post('/comments', authenticateToken, async (req, res) => {
  try {
    const { content, report_id, suggestion_id } = req.body;
    const user_id = req.user.id;
    if (!content || (!report_id && !suggestion_id)) {
      return res.status(400).json({ message: 'Content and either report_id or suggestion_id are required.' });
    }
    const comment = await Comment.create({ user_id, content, report_id, suggestion_id });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment.', error: error.message });
  }
});

// GET /api/comments?entity=report&id=1
router.get('/comments', async (req, res) => {
  try {
    const { entity, id } = req.query;
    let where = {};
    if (entity === 'report') where.report_id = id;
    if (entity === 'suggestion') where.suggestion_id = id;
    const comments = await Comment.findAll({ where });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments.', error: error.message });
  }
});

module.exports = router;
