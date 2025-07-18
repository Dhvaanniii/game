const { dynamodb, TABLES } = require('../config/dynamodb');

const createTables = async () => {
  try {
    console.log('Creating DynamoDB tables...');
    
    // 1. Users Table
    await createUsersTable();
    
    // 2. UserProgress Table
    await createUserProgressTable();
    
    // 3. UserSubscriptions Table
    // await createUserSubscriptionsTable(); // This table is removed from the schema
    
    // 4. Levels Table
    await createUserLevelAccessTable();
    await createLevelsTable();
    
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const createUsersTable = async () => {
  const params = {
    TableName: TABLES.USERS,
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('✓ Users table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('✓ Users table already exists');
    } else {
      throw error;
    }
  }
};

const createUserProgressTable = async () => {
  const params = {
    TableName: TABLES.USER_PROGRESS,
    KeySchema: [
      {
        AttributeName: 'user_id',
        KeyType: 'HASH' // Partition key
      },
      {
        AttributeName: 'level_number',
        KeyType: 'RANGE' // Sort key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'user_id',
        AttributeType: 'S'
      },
      {
        AttributeName: 'level_number',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('✓ UserProgress table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('✓ UserProgress table already exists');
    } else {
      throw error;
    }
  }
};

const createUserLevelAccessTable = async () => {
  const params = {
    TableName: TABLES.USER_LEVEL_ACCESS,
    KeySchema: [
      {
        AttributeName: 'user_id',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'user_id',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };
  try {
    await dynamodb.createTable(params).promise();
    console.log('✓ UserLevelAccess table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('✓ UserLevelAccess table already exists');
    } else {
      throw error;
    }
  }
};

const createLevelsTable = async () => {
  const params = {
    TableName: TABLES.LEVELS,
    KeySchema: [
      {
        AttributeName: 'category_level_id',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'category_level_id',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('✓ Levels table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('✓ Levels table already exists');
    } else {
      throw error;
    }
  }
};

// Run the script
if (require.main === module) {
  createTables();
}

module.exports = { createTables };