const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Level = require('../models/Level');

// Connect to your MongoDB (adjust URI as needed)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const outlinesDir = path.join(__dirname, '../outlines/tangram');

async function importSVGs() {
  const files = fs.readdirSync(outlinesDir).filter(f => f.endsWith('.svg') && /^level-\d+\.svg$/.test(f));
  for (const file of files) {
    const match = file.match(/^level-(\d+)\.svg$/);
    if (!match) continue;
    const levelNumber = parseInt(match[1], 10);
    const outlinePath = path.join('outlines/tangram', file);

    // Check if Level already exists
    const exists = await Level.findOne({ category: 'tangram', outlinePath });
    if (exists) {
      console.log(`Level for ${file} already exists, skipping.`);
      continue;
    }

    // Create new Level entry
    const level = new Level({
      category: 'tangram',
      levelNumber,
      outlinePath,
      // ...add other fields as needed
    });
    await level.save();
    console.log(`Created Level entry for ${file}`);
  }
  mongoose.disconnect();
}

importSVGs().catch(err => {
  console.error('Error importing SVGs:', err);
  mongoose.disconnect();
}); 