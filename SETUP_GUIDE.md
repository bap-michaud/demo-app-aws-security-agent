# Citation App Setup Guide

This guide will help you set up the AWS infrastructure and database connections for the Citation Application.

## Prerequisites

- Node.js 20+ installed
- AWS account with appropriate permissions
- AWS CLI configured (optional, for manual setup)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Update the following in `.env.local`:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - Your preferred AWS region (default: us-east-1)
- `DATABASE_URL` - Your PostgreSQL connection string for Aurora Serverless v2

### 3. Set Up AWS Infrastructure

#### Option A: Automated Setup (Recommended)

Run the setup scripts to create all AWS resources:

```bash
# Create DynamoDB table
npm run db:dynamodb:create

# Create Cognito User Pool
npm run auth:cognito:create
```

The Cognito script will output the User Pool ID and Client ID. Update your `.env.local` with these values.

#### Option B: Manual Setup

See the [Infrastructure README](./infrastructure/README.md) for detailed manual setup instructions using AWS CLI.

### 4. Set Up Database

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Migrations (when database is available)

```bash
npx prisma migrate deploy
```

For development with a local database:

```bash
npx prisma migrate dev
```

## Project Structure

```
.
├── lib/
│   └── db/
│       ├── dynamodb.ts      # DynamoDB client configuration
│       ├── cognito.ts       # Cognito client configuration
│       └── prisma.ts        # Prisma client for Aurora
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── scripts/
│   ├── create-dynamodb-table.ts    # DynamoDB setup script
│   └── create-cognito-user-pool.ts # Cognito setup script
├── infrastructure/
│   ├── dynamodb-table.json         # DynamoDB IaC config
│   ├── cognito-user-pool.json      # Cognito IaC config
│   └── README.md                   # Infrastructure documentation
└── prisma.config.ts         # Prisma 7 configuration
```

## Database Clients

### DynamoDB Client

```typescript
import { dynamoDBClient, PutCommand, GetCommand, QueryCommand } from '@/lib/db/dynamodb';

// Example: Put an item
await dynamoDBClient.send(new PutCommand({
  TableName: 'citations',
  Item: { PK: 'CITATION#123', SK: 'METADATA', ... }
}));
```

### Cognito Client

```typescript
import { cognitoClient, InitiateAuthCommand } from '@/lib/db/cognito';

// Example: Authenticate user
const response = await cognitoClient.send(new InitiateAuthCommand({
  AuthFlow: 'USER_PASSWORD_AUTH',
  ClientId: process.env.COGNITO_CLIENT_ID,
  AuthParameters: { USERNAME: 'user@example.com', PASSWORD: 'password' }
}));
```

### Prisma Client

```typescript
import { prisma } from '@/lib/db/prisma';

// Example: Query citations
const citations = await prisma.citation.findMany({
  include: { favorites: true }
});
```

## Test Users

After running the Cognito setup script, you'll have two test users:

- **Admin**: `admin@example.com` / `AdminPass123!`
- **User**: `user@example.com` / `UserPass123!`

## Development with Local Services

### Local DynamoDB

```bash
# Start local DynamoDB
docker run -p 8000:8000 amazon/dynamodb-local

# Update .env.local
DYNAMODB_ENDPOINT=http://localhost:8000

# Create table
npm run db:dynamodb:create
```

### Local PostgreSQL (for Aurora development)

```bash
# Start local PostgreSQL
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=citations postgres:15

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/citations?schema=public"

# Run migrations
npx prisma migrate dev
```

## Troubleshooting

### DynamoDB Connection Issues

- Verify AWS credentials are correct
- Check that the region matches your configuration
- For local DynamoDB, ensure Docker is running and the endpoint is correct

### Cognito Issues

- Ensure you have the correct permissions to create user pools
- Verify the region is correct
- Check that the User Pool ID and Client ID are updated in `.env.local`

### Prisma Issues

- Ensure the DATABASE_URL is correct
- For Prisma 7, make sure `prisma.config.ts` exists in the root
- Run `npx prisma generate` after any schema changes

## Next Steps

After completing the setup:

1. Start the development server: `npm run dev`
2. Begin implementing the authentication system (Task 3)
3. Build the citation data access layer (Task 4)

For more information, see the [Infrastructure README](./infrastructure/README.md).
