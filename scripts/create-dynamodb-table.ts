import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

const tableName = process.env.DYNAMODB_TABLE_NAME || 'citations';

async function createTable() {
  try {
    // Check if table already exists
    try {
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      await client.send(describeCommand);
      console.log(`Table ${tableName} already exists`);
      return;
    } catch (error: any) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Create table
    const createCommand = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'GSI1PK', AttributeType: 'S' },
        { AttributeName: 'GSI1SK', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI1',
          KeySchema: [
            { AttributeName: 'GSI1PK', KeyType: 'HASH' },
            { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    await client.send(createCommand);
    console.log(`Table ${tableName} created successfully`);
    console.log('Table structure:');
    console.log('- Primary Key: PK (HASH), SK (RANGE)');
    console.log('- GSI1: GSI1PK (HASH), GSI1SK (RANGE) - for author-based queries');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

createTable()
  .then(() => {
    console.log('DynamoDB table setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create DynamoDB table:', error);
    process.exit(1);
  });
