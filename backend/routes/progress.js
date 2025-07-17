const express = require('express');
const UserProgress = require('../models/UserProgress');
const router = express.Router();

// Get user progress
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.findByUser(userId);
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get user stats
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await UserProgress.getUserStats(userId);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get weekly progress
router.get('/weekly/:userId/:weekKey', async (req, res) => {
  try {
    const { userId, weekKey } = req.params;
    const progress = await UserProgress.getWeeklyProgress(userId, weekKey);
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Get weekly progress error:', error);
    res.status(500).json({ error: 'Failed to get weekly progress' });
  }
});

// Get leaderboard
router.get('/leaderboard/:category?', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;
    const leaderboard = await UserProgress.getLeaderboard(category, parseInt(limit));
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Update progress
router.put('/:userId/:progressKey', async (req, res) => {
  try {
    const { userId, progressKey } = req.params;
    await UserProgress.updateProgress(userId, progressKey, req.body);
    res.json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;