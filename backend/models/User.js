const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const userId = `USER_${uuidv4()}`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = {
      userId, // Partition key
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      realname: userData.realname,
      language: userData.language,
      school: userData.school,
      standard: userData.standard,
      board: userData.board,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      coins: 0, // Starting coins
      userType: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const params = {
      TableName: TABLES.USERS,
      Item: user,
      ConditionExpression: 'attribute_not_exists(userId)'
    };

    try {
      await docClient.put(params).promise();
      // Remove password from returned user
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async createDefaultAdmin() {
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      realname: 'Administrator',
      language: 'en',
      school: 'Admin School',
      standard: 'Admin',
      board: 'Admin',
      country: 'AdminLand',
      state: 'AdminState',
      city: 'AdminCity',
      userType: 'admin',
    };
    // Check if admin already exists
    const existingAdmin = await this.findByUsername('admin');
    if (!existingAdmin) {
      return await this.create(adminData);
    }
    return existingAdmin;
  }

  static async findByEmail(email) {
    const params = {
      TableName: TABLES.USERS,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    try {
      const result = await docClient.scan(params).promise();
      return result.Items[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    const params = {
      TableName: TABLES.USERS,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username
      }
    };

    try {
      const result = await docClient.scan(params).promise();
      return result.Items[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(userId) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId }
    };

    try {
      const result = await docClient.get(params).promise();
      return result.Item || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString()
      }
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async updateCoins(userId, coins) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: 'ADD coins :coins',
      ExpressionAttributeValues: {
        ':coins': coins
      }
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    Object.keys(updateData).forEach(key => {
      if (key !== 'userId') { // allow updating all except userId
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });
    const params = {
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames
    };
    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    const params = {
      TableName: TABLES.USERS
    };

    try {
      const result = await docClient.scan(params).promise();
      return result.Items.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId }
    };

    try {
      await docClient.delete(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;