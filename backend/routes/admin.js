const express = require('express');
const User = require('../models/User');
const Level = require('../models/Level');
const UserProgress = require('../models/UserProgress');
const router = express.Router();

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    const levels = await Level.getAllLevels();
    
    // Calculate stats
    const stats = {
      totalUsers: users.length,
      totalLevels: levels.length,
      activeUsers: users.filter(user => {
        const lastLogin = new Date(user.lastLogin || 0);
        const daysSinceLogin = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLogin <= 7; // Active in last 7 days
      }).length,
      levelsByCategory: {}
    };

    // Group levels by category
    levels.forEach(level => {
      if (!stats.levelsByCategory[level.category]) {
        stats.levelsByCategory[level.category] = 0;
      }
      stats.levelsByCategory[level.category]++;
    });

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Get user details with progress
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const progress = await UserProgress.findByUser(userId);
    const stats = await UserProgress.getUserStats(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      progress,
      stats
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

// Update user (admin only)
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await User.updateProfile(userId, req.body);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Delete user progress first
    const progress = await UserProgress.findByUser(userId);
    for (const p of progress) {
      await UserProgress.deleteProgress(userId, p.progressKey);
    }
    
    // Delete user
    await User.deleteUser(userId);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    };

    res.json({ success: true, health });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

module.exports = router;