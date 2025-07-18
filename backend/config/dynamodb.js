const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1'
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Table names - matching your existing tables
const TABLES = {
  USERS: 'Users',
  USER_PROGRESS: 'UserProgress',
  USER_LEVEL_ACCESS: 'UserLevelAccess',
  LEVELS: 'Levels'
};

module.exports = {
  dynamodb,
  docClient,
  TABLES
};