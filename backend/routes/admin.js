const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Level = require('../models/Level');

const router = express.Router();
const upload = multer({
  dest: path.join(__dirname, '../outlines/tangram/'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/svg+xml') cb(null, true);
    else cb(new Error('Only SVG files are allowed!'));
  }
});

router.post('/upload-tangram-svg', upload.single('svg'), async (req, res) => {
  try {
    const svgFile = req.file;
    if (!svgFile) return res.status(400).json({ success: false, error: 'No SVG file uploaded' });

    // Optionally rename the file for uniqueness
    const newFilename = `tangram-${Date.now()}-${Math.floor(Math.random() * 10000)}.svg`;
    const newPath = path.join(svgFile.destination, newFilename);
    fs.renameSync(svgFile.path, newPath);

    // Create Level entry
    const level = new Level({
      category: 'tangram',
      outlinePath: path.join('outlines/tangram', newFilename),
      // ...other fields as needed
    });
    await level.save();

    res.json({ success: true, level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;