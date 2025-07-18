const { docClient, TABLES } = require('../config/dynamodb');

class UserLevelAccess {
  // PK: user_id
  static async openLevel({ user_id, category, level }) {
    const opened_at = new Date().toISOString();
    const relock_at = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    const item = {
      user_id,
      category,
      level,
      opened_at,
      relock_at,
      unlocked: true
    };
    const params = {
      TableName: TABLES.USER_LEVEL_ACCESS,
      Item: item
    };
    await docClient.put(params).promise();
    return item;
  }

  static async getAccess(user_id) {
    const params = {
      TableName: TABLES.USER_LEVEL_ACCESS,
      Key: { user_id }
    };
    const result = await docClient.get(params).promise();
    return result.Item || null;
  }

  static async relockLevel(user_id) {
    const relock_at = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    const params = {
      TableName: TABLES.USER_LEVEL_ACCESS,
      Key: { user_id },
      UpdateExpression: 'SET relock_at = :relock_at, unlocked = :unlocked',
      ExpressionAttributeValues: {
        ':relock_at': relock_at,
        ':unlocked': false
      }
    };
    await docClient.update(params).promise();
    return { relock_at, unlocked: false };
  }

  static async unlockLevel(user_id) {
    const params = {
      TableName: TABLES.USER_LEVEL_ACCESS,
      Key: { user_id },
      UpdateExpression: 'SET unlocked = :unlocked',
      ExpressionAttributeValues: {
        ':unlocked': true
      }
    };
    await docClient.update(params).promise();
    return { unlocked: true };
  }
}

module.exports = UserLevelAccess; 