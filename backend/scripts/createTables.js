const { dynamodb, TABLES } = require('../config/dynamodb');

const createTables = async () => {
  try {
    console.log('Creating DynamoDB tables...');
    
    // 1. Users Table
    await createUsersTable();
    
    // 2. UserProgress Table
    await createUserProgressTable();
    
    // 3. UserSubscriptions Table
    await createUserSubscriptionsTable();
    
    // 4. Levels Table
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
        AttributeName: 'userId',
        KeyType: 'HASH' // Partition key
      },
      {
        AttributeName: 'progressKey',
        KeyType: 'RANGE' // Sort key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'progressKey',
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

const createUserSubscriptionsTable = async () => {
  const params = {
    TableName: TABLES.USER_SUBSCRIPTIONS,
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH' // Partition key
      },
      {
        AttributeName: 'subscriptionKey',
        KeyType: 'RANGE' // Sort key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'subscriptionKey',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('✓ UserSubscriptions table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('✓ UserSubscriptions table already exists');
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
        AttributeName: 'levelId',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'levelId',
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