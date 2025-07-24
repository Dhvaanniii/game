const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const fs = require('fs');
const Level = require('../models/Level');

const QUESTIONS_DIR = path.join(__dirname, '../outlines/tangram/questions');
const ANSWERS_DIR = path.join(__dirname, '../outlines/tangram/answers');

async function bulkUpdateTangramLevels() {
  const questionFiles = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.jpg'));
  const answerFiles = fs.readdirSync(ANSWERS_DIR).filter(f => f.endsWith('.jpg'));

  // Map: levelNumber => { question, answer }
  const levels = {};
  questionFiles.forEach(file => {
    const match = file.match(/level-(\d+)\.jpg/);
    if (match) {
      const levelNumber = parseInt(match[1], 10);
      levels[levelNumber] = levels[levelNumber] || {};
      levels[levelNumber].question = path.join('backend/outlines/tangram/questions', file);
    }
  });
  answerFiles.forEach(file => {
    const match = file.match(/answer-(\d+)\.jpg/);
    if (match) {
      const levelNumber = parseInt(match[1], 10);
      levels[levelNumber] = levels[levelNumber] || {};
      levels[levelNumber].answer = path.join('backend/outlines/tangram/answers', file);
    }
  });

  for (const levelNumber of Object.keys(levels).map(Number).sort((a, b) => a - b)) {
    const data = levels[levelNumber];
    const category_level_id = `TANGRAM_L${levelNumber}`;
    const levelData = {
      category_level_id,
      category: 'tangram',
      subpart: 'tangram',
      levelNumber,
      pageNumber: null,
      outlineUrl: null,
      questionData: data.question || null,
      correctAnswer: data.answer || null,
      hint: null,
      timeLimit: 300,
      uploadDate: new Date().toISOString(),
      hasBeenPlayed: 0,
      createdBy: 'admin',
    };
    try {
      await Level.updateLevel(category_level_id, levelData);
      console.log(`Updated level ${category_level_id}`);
    } catch (err) {
      // If not exists, create
      try {
        await Level.create(levelData);
        console.log(`Created level ${category_level_id}`);
      } catch (e) {
        console.error(`Failed to create/update level ${category_level_id}:`, e.message);
      }
    }
  }
  console.log('Bulk update complete.');
}

bulkUpdateTangramLevels(); 