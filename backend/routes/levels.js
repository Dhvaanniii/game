const express = require('express');
const multer = require('multer');
const Level = require('../models/Level');
const UserProgress = require('../models/UserProgress');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const OUTLINES_DIR = path.join(__dirname, '../outlines/tangram');

// Ensure outlines directory exists
if (!fs.existsSync(OUTLINES_DIR)) {
  fs.mkdirSync(OUTLINES_DIR, { recursive: true });
}

// Serve outlines as static files
router.use('/static/outlines/tangram', express.static(OUTLINES_DIR));

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

// Upload PDF and create levels (Tangram)
router.post('/upload/:category', upload.single('pdf'), async (req, res) => {
  try {
    const { category } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // Only process for tangram category
    if (category !== 'tangram') {
      return res.status(400).json({ error: 'Only tangram PDF upload is supported in this endpoint.' });
    }

    // Get next level number for this category
    const nextLevelNumber = await Level.getNextLevelNumber(category);

    // Read PDF and extract pages
    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    const levelsData = [];

    for (let i = 0; i < pageCount; i++) {
      // Extract single page as new PDF
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const singlePagePdfBytes = await newPdf.save();

      const levelNumber = nextLevelNumber + i;
      const outlinePath = path.join(OUTLINES_DIR, `level_${levelNumber}.pdf`);
      fs.writeFileSync(outlinePath, singlePagePdfBytes);
      const outlineUrl = `/api/levels/static/outlines/tangram/level_${levelNumber}.pdf`;

      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + (levelNumber - 1));
      unlockDate.setHours(0, 0, 0, 0);
      const lockDate = new Date(unlockDate);
      lockDate.setDate(lockDate.getDate() + 15);

      levelsData.push({
        category,
        subpart: 'none',
        levelNumber,
        pageNumber: i + 1,
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

// Validate tangram solution
router.post('/:levelId/validate', async (req, res) => {
  try {
    const { levelId } = req.params;
    const { arrangement } = req.body; // array of placed blocks

    // Load the correct answer arrangement for this level
    const level = await Level.findById(levelId);
    if (!level || !level.correctAnswer) {
      return res.status(400).json({ error: 'No correct answer set for this level.' });
    }

    // correctAnswer is stored as JSON string, parse it
    let correctArrangement;
    try {
      correctArrangement = typeof level.correctAnswer === 'string' ? JSON.parse(level.correctAnswer) : level.correctAnswer;
    } catch (e) {
      return res.status(500).json({ error: 'Invalid correct answer format.' });
    }

    // Simple deep equality check (order and values must match)
    const isEqual = (a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    };

    const isCorrect = isEqual(arrangement, correctArrangement);
    res.json({ success: isCorrect });
  } catch (error) {
    console.error('Validate tangram solution error:', error);
    res.status(500).json({ error: 'Failed to validate solution' });
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

router.get('/tangram-levels', async (req, res) => {
  const levels = await Level.find({ type: 'tangram' }); // adjust query as needed
  res.json(levels);
});

module.exports = router;