# Citation Application

A Next.js web application for browsing and managing famous citations, featuring AWS Cognito authentication, DynamoDB for fast citation retrieval, and Aurora Serverless v2 for detailed data storage.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Authentication**: AWS Cognito
- **Databases**: 
  - DynamoDB (citation metadata and search)
  - Aurora Serverless v2 PostgreSQL (detailed citations and user favorites)
- **ORM**: Prisma
- **AWS SDK**: v3

## Project Structure

```
.
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Business logic and utilities
│   ├── auth/              # Authentication utilities
│   ├── db/                # Database clients and queries
│   │   └── queries/       # Database query functions
│   └── services/          # Business logic services
├── public/                # Static assets
└── .kiro/                 # Kiro configuration and specs
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS account with access to:
  - DynamoDB
  - Aurora Serverless v2
  - Cognito
- AWS credentials configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local` file with your AWS credentials and service endpoints

5. Initialize Prisma:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for required environment variables:

- **AWS Configuration**: Region, access keys
- **DynamoDB**: Table name and endpoint
- **Aurora**: Database connection URL
- **Cognito**: User pool ID and client ID

## Features

- 🔓 Public citation browsing
- 🔐 User authentication with AWS Cognito
- ⭐ Favorite citations (authenticated users)
- 🔍 Search by author or keyword
- 📝 Admin panel for adding citations
- 📱 Responsive design with Tailwind CSS

## Development Workflow

This project uses Kiro specs for structured development. See `.kiro/specs/aws-security-agent-demo/` for:
- `requirements.md` - Feature requirements
- `design.md` - System design and architecture
- `tasks.md` - Implementation task list

## License

MIT
