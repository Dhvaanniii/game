const { docClient, TABLES } = require('../config/dynamodb');

class UserProgress {
  static async create(progressData) {
    const progress = {
      userId: progressData.userId, // Partition key
      progressKey: progressData.progressKey, // Sort key - e.g., "TANGLE_L1" or "FUNTHINKER_BASIC_L1"
      levelId: progressData.levelId,
      category: progressData.category,
      subpart: progressData.subpart || 'none',
      levelNumber: progressData.levelNumber,
      attemptNumber: progressData.attemptNumber,
      completed: progressData.completed,
      stars: progressData.stars || 0,
      points: progressData.points || 0,
      timeUsed: progressData.timeUsed || 0,
      completedAt: new Date().toISOString(),
      weekKey: this.getWeekKey(new Date())
    };

    const params = {
      TableName: TABLES.USER_PROGRESS,
      Item: progress
    };

    try {
      await docClient.put(params).promise();
      return progress;
    } catch (error) {
      throw error;
    }
  }

  static async findByUser(userId) {
    const params = {
      TableName: TABLES.USER_PROGRESS,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    try {
      const result = await docClient.query(params).promise();
      return result.Items;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserAndLevel(userId, progressKey) {
    const params = {
      TableName: TABLES.USER_PROGRESS,
      Key: {
        userId,
        progressKey
      }
    };

    try {
      const result = await docClient.get(params).promise();
      return result.Item || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateProgress(userId, progressKey, updateData) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'userId' && key !== 'progressKey') {
        updateExpression.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    // Always update the completion timestamp
    updateExpression.push('completedAt = :completedAt');
    expressionAttributeValues[':completedAt'] = new Date().toISOString();

    const params = {
      TableName: TABLES.USER_PROGRESS,
      Key: { userId, progressKey },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async deleteProgress(userId, progressKey) {
    const params = {
      TableName: TABLES.USER_PROGRESS,
      Key: { userId, progressKey }
    };

    try {
      await docClient.delete(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async getUserStats(userId) {
    const progress = await this.findByUser(userId);
    
    const stats = {
      totalLevelsCompleted: progress.filter(p => p.completed).length,
      totalPoints: progress.reduce((sum, p) => sum + (p.points || 0), 0),
      totalStars: progress.reduce((sum, p) => sum + (p.stars || 0), 0),
      averageAttempts: 0,
      categoryStats: {}
    };

    // Calculate category-wise stats
    const categories = ['tangle', 'funthinker-basic', 'funthinker-medium', 'funthinker-hard'];
    
    categories.forEach(category => {
      const categoryProgress = progress.filter(p => p.category === category);
      stats.categoryStats[category] = {
        completed: categoryProgress.filter(p => p.completed).length,
        points: categoryProgress.reduce((sum, p) => sum + (p.points || 0), 0),
        stars: categoryProgress.reduce((sum, p) => sum + (p.stars || 0), 0)
      };
    });

    // Calculate average attempts
    const completedLevels = progress.filter(p => p.completed);
    if (completedLevels.length > 0) {
      stats.averageAttempts = completedLevels.reduce((sum, p) => sum + p.attemptNumber, 0) / completedLevels.length;
    }

    return stats;
  }

  static async getWeeklyProgress(userId, weekKey) {
    const params = {
      TableName: TABLES.USER_PROGRESS,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'weekKey = :weekKey',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':weekKey': weekKey
      }
    };

    try {
      const result = await docClient.query(params).promise();
      return result.Items;
    } catch (error) {
      throw error;
    }
  }

  static getWeekKey(date) {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  static getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  static async getLeaderboard(category = null, limit = 10) {
    const params = {
      TableName: TABLES.USER_PROGRESS
    };

    if (category) {
      params.FilterExpression = 'category = :category';
      params.ExpressionAttributeValues = {
        ':category': category
      };
    }

    try {
      const result = await docClient.scan(params).promise();
      
      // Group by user and calculate totals
      const userStats = {};
      result.Items.forEach(item => {
        if (!userStats[item.userId]) {
          userStats[item.userId] = {
            userId: item.userId,
            totalPoints: 0,
            totalStars: 0,
            levelsCompleted: 0
          };
        }
        
        if (item.completed) {
          userStats[item.userId].totalPoints += item.points || 0;
          userStats[item.userId].totalStars += item.stars || 0;
          userStats[item.userId].levelsCompleted += 1;
        }
      });

      // Sort by total points and return top users
      return Object.values(userStats)
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, limit);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserProgress;