# Infrastructure Configuration

This directory contains infrastructure configuration files for the Citation Application.

## DynamoDB Table

### Table Structure

**Table Name:** `citations`

**Primary Key:**
- `PK` (String, HASH) - Partition key in format `CITATION#<uuid>`
- `SK` (String, RANGE) - Sort key, typically `METADATA`

**Global Secondary Index (GSI1):**
- `GSI1PK` (String, HASH) - Format: `AUTHOR#<authorName>`
- `GSI1SK` (String, RANGE) - ISO timestamp for sorting

**Purpose:**
- Fast citation listing and retrieval
- Author-based search queries
- Keyword search in quote text

### Creating the Table

#### Option 1: Using the TypeScript Script

```bash
npm run db:dynamodb:create
```

This script will:
- Check if the table already exists
- Create the table with the correct schema if it doesn't exist
- Set up the GSI1 index for author queries

#### Option 2: Using AWS CLI with JSON Configuration

```bash
aws dynamodb create-table --cli-input-json file://infrastructure/dynamodb-table.json
```

#### Option 3: Using Local DynamoDB (for development)

1. Start local DynamoDB:
```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

2. Set `DYNAMODB_ENDPOINT=http://localhost:8000` in your `.env.local`

3. Run the creation script:
```bash
npm run db:dynamodb:create
```

### Data Model

Citations are stored with the following structure:

```typescript
{
  PK: "CITATION#<uuid>",
  SK: "METADATA",
  id: "<uuid>",
  quoteText: "The quote text",
  authorName: "Author Name",
  category: "Category",
  tags: ["tag1", "tag2"],
  createdAt: "2024-01-01T00:00:00.000Z",
  GSI1PK: "AUTHOR#Author Name",
  GSI1SK: "2024-01-01T00:00:00.000Z"
}
```

### Access Patterns

1. **List all citations:** Scan or Query on PK/SK
2. **Get citation by ID:** Query with `PK = CITATION#<id>` and `SK = METADATA`
3. **Search by author:** Query GSI1 with `GSI1PK = AUTHOR#<authorName>`
4. **Search by keyword:** Scan with filter expression on `quoteText`

## Cognito User Pool

### User Pool Configuration

**Pool Name:** `citation-app-users`

**Authentication:**
- Email-based authentication
- Password requirements: 8+ characters, uppercase, lowercase, numbers, symbols
- MFA: Optional
- Account recovery via email

**User Attributes:**
- `email` (required, verified)
- `name` (optional)
- `custom:role` (optional) - USER or ADMIN

**User Groups:**
- `Admins` - Administrator users with full access
- `Users` - Regular users with standard access

### Creating the User Pool

#### Option 1: Using the TypeScript Script

```bash
npm run auth:cognito:create
```

This script will:
- Create the user pool with password policies
- Create a user pool client for authentication
- Create Admin and Users groups
- Create test users:
  - Admin: `admin@example.com` / `AdminPass123!`
  - User: `user@example.com` / `UserPass123!`

#### Option 2: Using AWS CLI with JSON Configuration

```bash
aws cognito-idp create-user-pool --cli-input-json file://infrastructure/cognito-user-pool.json
```

### Test Users

After running the setup script, you'll have two test users:

1. **Admin User**
   - Email: `admin@example.com`
   - Password: `AdminPass123!`
   - Group: Admins
   - Role: ADMIN

2. **Regular User**
   - Email: `user@example.com`
   - Password: `UserPass123!`
   - Group: Users
   - Role: USER

### Environment Variables

After creating the user pool, update your `.env.local` with:

```
COGNITO_USER_POOL_ID=<your-user-pool-id>
COGNITO_CLIENT_ID=<your-client-id>
COGNITO_REGION=us-east-1
```
