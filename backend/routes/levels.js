const express = require('express');
const multer = require('multer');
const Level = require('../models/Level');
const UserProgress = require('../models/UserProgress');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get levels by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const levels = await Level.findByCategory(category);
    res.json({ success: true, levels });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Failed to get levels' });
  }
});

// Get single level
router.get('/:category/:levelNumber', async (req, res) => {
  try {
    const { category, levelNumber } = req.params;
    const levelId = `${category.toUpperCase()}_L${levelNumber}`;
    const level = await Level.findById(levelId);
    
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    res.json({ success: true, level });
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({ error: 'Failed to get level' });
  }
});

// Upload PDF and create levels
router.post('/upload/:category', upload.single('pdf'), async (req, res) => {
  try {
    const { category } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // Get next level number for this category
    const nextLevelNumber = await Level.getNextLevelNumber(category);

    // Simulate PDF processing (in real implementation, use pdf-parse)
    const pageCount = Math.floor(Math.random() * 10) + 5; // Random 5-15 pages
    const levelsData = [];

    for (let i = 1; i <= pageCount; i++) {
      const levelNumber = nextLevelNumber + i - 1;
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + (levelNumber - 1));
      unlockDate.setHours(0, 0, 0, 0);

      const lockDate = new Date(unlockDate);
      lockDate.setDate(lockDate.getDate() + 15);

      // Create mock outline URL (in real implementation, convert PDF page to image)
      const outlineUrl = `data:image/svg+xml;base64,${Buffer.from(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
          <text x="200" y="150" text-anchor="middle" font-size="16" fill="#333">
            ${category.toUpperCase()} Level ${levelNumber}
          </text>
          <text x="200" y="180" text-anchor="middle" font-size="14" fill="#666">
            Page ${i} from PDF
          </text>
        </svg>
      `).toString('base64')}`;

      levelsData.push({
        category,
        subpart: category.includes('funthinker') ? category.split('-')[1] : 'none',
        levelNumber,
        pageNumber: i,
        outlineUrl,
        unlockDate: unlockDate.toISOString(),
        lockDate: lockDate.toISOString(),
        timeLimit: 300,
        createdBy: req.userId || 'admin'
      });
    }

    // Create levels in database
    const createdLevels = await Level.createMultipleLevels(levelsData);

    res.json({
      success: true,
      message: `Successfully created ${createdLevels.length} levels`,
      levels: createdLevels
    });
  } catch (error) {
    console.error('Upload PDF error:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Delete level
router.delete('/:levelId', async (req, res) => {
  try {
    const { levelId } = req.params;
    await Level.deleteLevel(levelId);
    res.json({ success: true, message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Delete level error:', error);
    res.status(500).json({ error: 'Failed to delete level' });
  }
});

// Update level
router.put('/:levelId', async (req, res) => {
  try {
    const { levelId } = req.params;
    await Level.updateLevel(levelId, req.body);
    res.json({ success: true, message: 'Level updated successfully' });
  } catch (error) {
    console.error('Update level error:', error);
    res.status(500).json({ error: 'Failed to update level' });
  }
});

// Submit level completion
router.post('/:levelId/complete', async (req, res) => {
  try {
    const { levelId } = req.params;
    const { userId, attemptNumber, completed, stars, points, timeUsed } = req.body;

    // Get level details
    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    // Create progress key
    const progressKey = `${level.category.toUpperCase()}_L${level.levelNumber}`;

    // Save user progress
    const progressData = {
      userId,
      progressKey,
      levelId,
      category: level.category,
      subpart: level.subpart,
      levelNumber: level.levelNumber,
      attemptNumber,
      completed,
      stars: stars || 0,
      points: points || 0,
      timeUsed: timeUsed || 0
    };

    await UserProgress.create(progressData);

    // Mark level as played if completed
    if (completed) {
      await Level.markAsPlayed(levelId);
    }

    res.json({ success: true, message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Complete level error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get all levels (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const levels = await Level.getAllLevels();
    res.json({ success: true, levels });
  } catch (error) {
    console.error('Get all levels error:', error);
    res.status(500).json({ error: 'Failed to get levels' });
  }
});

module.exports = router;