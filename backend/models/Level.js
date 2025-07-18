const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class Level {
  static async create(levelData) {
    const category_level_id = `${levelData.category.toUpperCase()}_L${levelData.levelNumber}`;
    
    const level = {
      category_level_id, // Partition key
      category: levelData.category,
      subpart: levelData.subpart || 'none',
      levelNumber: levelData.levelNumber,
      pageNumber: levelData.pageNumber,
      outlineUrl: levelData.outlineUrl,
      questionData: levelData.questionData || '',
      correctAnswer: levelData.correctAnswer || '',
      hint: levelData.hint || '',
      timeLimit: levelData.timeLimit || 300, // 5 minutes default
      unlockDate: levelData.unlockDate,
      lockDate: levelData.lockDate,
      uploadDate: new Date().toISOString(),
      hasBeenPlayed: false,
      createdBy: levelData.createdBy || 'admin'
    };

    const params = {
      TableName: TABLES.LEVELS,
      Item: level,
      ConditionExpression: 'attribute_not_exists(category_level_id)'
    };

    try {
      await docClient.put(params).promise();
      return level;
    } catch (error) {
      throw error;
    }
  }

  static async findByCategory(category) {
    const params = {
      TableName: TABLES.LEVELS,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    };

    try {
      const result = await docClient.scan(params).promise();
      return result.Items.sort((a, b) => a.levelNumber - b.levelNumber);
    } catch (error) {
      throw error;
    }
  }

  static async findById(category_level_id) {
    const params = {
      TableName: TABLES.LEVELS,
      Key: { category_level_id }
    };

    try {
      const result = await docClient.get(params).promise();
      return result.Item || null;
    } catch (error) {
      throw error;
    }
  }

  static async getNextLevelNumber(category) {
    const levels = await this.findByCategory(category);
    if (levels.length === 0) return 1;
    
    const maxLevel = Math.max(...levels.map(level => level.levelNumber));
    return maxLevel + 1;
  }

  static async createMultipleLevels(levelsData) {
    const createdLevels = [];
    
    for (const levelData of levelsData) {
      try {
        const level = await this.create(levelData);
        createdLevels.push(level);
      } catch (error) {
        console.error(`Error creating level ${levelData.levelNumber}:`, error);
      }
    }
    
    return createdLevels;
  }

  static async updateLevel(category_level_id, updateData) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'category_level_id') {
        updateExpression.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    const params = {
      TableName: TABLES.LEVELS,
      Key: { category_level_id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async deleteLevel(category_level_id) {
    const params = {
      TableName: TABLES.LEVELS,
      Key: { category_level_id }
    };

    try {
      await docClient.delete(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async markAsPlayed(category_level_id) {
    const params = {
      TableName: TABLES.LEVELS,
      Key: { category_level_id },
      UpdateExpression: 'SET hasBeenPlayed = :played',
      ExpressionAttributeValues: {
        ':played': true
      }
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async getAllLevels() {
    const params = {
      TableName: TABLES.LEVELS
    };

    try {
      const result = await docClient.scan(params).promise();
      return result.Items;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Level;