# Implementation Plan

- [x] 1. Initialize Next.js project and configure development environment
  - Create Next.js 14+ project with TypeScript and App Router
  - Install and configure Tailwind CSS
  - Set up project structure with lib, components, and app directories
  - Configure environment variables for AWS services
  - _Requirements: All_

- [ ] 2. Set up AWS infrastructure and database connections
  - [x] 2.1 Configure AWS SDK v3 for DynamoDB and Cognito
    - Install AWS SDK packages
    - Create DynamoDB client configuration in `lib/db/dynamodb.ts`
    - Create Cognito client configuration in `lib/db/cognito.ts`
    - _Requirements: 1.3, 2.2, 6.1_

  - [x] 2.2 Set up Prisma for Aurora Serverless v2
    - Install Prisma and initialize with PostgreSQL
    - Define Prisma schema for Citation, Favorite, and CitationRelation models
    - Create initial migration
    - Create Prisma client in `lib/db/prisma.ts`
    - _Requirements: 3.3, 4.2, 5.4_

  - [x] 2.3 Create DynamoDB table and indexes
    - Define Citations table with PK/SK structure
    - Create GSI1 for author-based queries
    - Implement table creation script or IaC configuration
    - _Requirements: 1.3, 6.1, 6.3_

  - [x] 2.4 Configure Cognito User Pool
    - Create Cognito User Pool with email/password authentication
    - Configure password policies
    - Set up user attributes and custom attributes for roles
    - Create test users (regular user and admin)
    - _Requirements: 2.2, 5.1_

- [ ] 3. Implement authentication system
  - [ ] 3.1 Create Cognito authentication service
    - Implement login function in `lib/services/authService.ts`
    - Implement logout function
    - Implement user registration function
    - Implement JWT token validation
    - _Requirements: 2.2, 2.3, 2.5_

  - [ ] 3.2 Implement session management
    - Create session utilities in `lib/auth/session.ts`
    - Implement JWT token storage in HTTP-only cookies
    - Create token refresh logic
    - _Requirements: 2.3, 2.5_

  - [ ] 3.3 Create authentication middleware
    - Implement route protection middleware in `lib/auth/middleware.ts`
    - Add role-based access control (USER vs ADMIN)
    - _Requirements: 2.3, 5.1_

  - [ ]* 3.4 Write property test for authentication success
    - **Property 2: Authentication success creates session**
    - **Validates: Requirements 2.3**

  - [ ]* 3.5 Write property test for authentication failure
    - **Property 3: Authentication failure preserves state**
    - **Validates: Requirements 2.4**

  - [ ]* 3.6 Write property test for logout
    - **Property 4: Logout terminates session**
    - **Validates: Requirements 2.5**

- [-] 4. Build citation data access layer
  - [x] 4.1 Implement DynamoDB citation queries
    - Create citation query functions in `lib/db/queries/citations.ts`
    - Implement listCitations function
    - Implement getCitationById function
    - Implement searchByAuthor function using GSI1
    - Implement searchByKeyword function
    - _Requirements: 1.3, 6.1, 6.3, 6.4_

  - [ ] 4.2 Implement Aurora citation queries
    - Create Prisma-based citation queries
    - Implement getDetailedCitation function
    - Implement getRelatedCitations function
    - _Requirements: 3.3, 3.4_

  - [ ] 4.3 Create citation service layer
    - Implement citation business logic in `lib/services/citationService.ts`
    - Create function to add citation to both databases
    - Implement dual-write logic with error handling
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ]* 4.4 Write property test for dual-database storage
    - **Property 12: Dual-database citation storage**
    - **Validates: Requirements 5.2, 5.3, 5.4**

  - [ ]* 4.5 Write property test for author search
    - **Property 15: Author search completeness**
    - **Validates: Requirements 6.3**

  - [ ]* 4.6 Write property test for keyword search
    - **Property 16: Keyword search accuracy**
    - **Validates: Requirements 6.4**

- [-] 5. Implement favorites functionality
  - [ ] 5.1 Create favorites data access layer
    - Implement favorites queries in `lib/db/queries/favorites.ts`
    - Create addFavorite function
    - Create removeFavorite function
    - Create getUserFavorites function
    - Create isFavorited function
    - _Requirements: 4.2, 4.4, 4.5_

  - [ ] 5.2 Create favorites service layer
    - Implement favorites business logic in `lib/services/favoriteService.ts`
    - Add validation and error handling
    - _Requirements: 4.2, 4.4, 4.5_

  - [ ]* 5.3 Write property test for favorite state persistence
    - **Property 9: Favorite state persistence**
    - **Validates: Requirements 4.2, 4.5**

  - [ ]* 5.4 Write property test for favorites page display
    - **Property 11: Favorites page displays all saved citations**
    - **Validates: Requirements 4.4**

- [ ] 6. Build API routes
  - [ ] 6.1 Create authentication API routes
    - Implement login endpoint in `app/api/auth/login/route.ts`
    - Implement logout endpoint in `app/api/auth/logout/route.ts`
    - Implement registration endpoint in `app/api/auth/register/route.ts`
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [ ] 6.2 Create citations API routes
    - Implement GET /api/citations to list citations from DynamoDB
    - Implement POST /api/citations to add new citation (admin only)
    - Implement GET /api/citations/[id] to get detailed citation from Aurora
    - _Requirements: 1.3, 3.3, 5.2_

  - [ ] 6.3 Create search API route
    - Implement GET /api/search with query parameters
    - Support author and keyword search modes
    - _Requirements: 6.1, 6.3, 6.4_

  - [ ] 6.4 Create favorites API routes
    - Implement GET /api/favorites to list user favorites
    - Implement POST /api/favorites to add favorite
    - Implement DELETE /api/favorites to remove favorite
    - _Requirements: 4.2, 4.4, 4.5_

- [ ] 7. Create UI components
  - [ ] 7.1 Build CitationCard component
    - Create `components/CitationCard.tsx`
    - Display quote text and author name
    - Show additional metadata for authenticated users
    - Include favorite button for authenticated users
    - _Requirements: 1.2, 3.1, 4.1_

  - [ ]* 7.2 Write property test for citation card completeness
    - **Property 1: Citation card completeness**
    - **Validates: Requirements 1.2**

  - [ ]* 7.3 Write property test for authenticated user metadata
    - **Property 5: Authenticated users see enhanced metadata**
    - **Validates: Requirements 3.1**

  - [ ]* 7.4 Write property test for favorite button presence
    - **Property 8: Favorite button presence**
    - **Validates: Requirements 4.1**

  - [ ] 7.5 Build CitationGrid component
    - Create `components/CitationGrid.tsx`
    - Implement responsive grid layout
    - Handle empty state
    - _Requirements: 1.4, 1.5_

  - [ ] 7.6 Build SearchBar component
    - Create `components/SearchBar.tsx`
    - Implement search input with debouncing
    - Add search mode toggle (author/keyword)
    - _Requirements: 6.1_

  - [ ] 7.7 Build FavoriteButton component
    - Create `components/FavoriteButton.tsx`
    - Implement toggle functionality
    - Show loading and error states
    - Update button state based on favorite status
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [ ]* 7.8 Write property test for favorite button state
    - **Property 10: Favorite button state reflects status**
    - **Validates: Requirements 4.3**

  - [ ] 7.9 Build LoginForm component
    - Create `components/LoginForm.tsx`
    - Implement email and password fields
    - Add form validation
    - Display error messages
    - _Requirements: 2.1, 2.4_

  - [ ] 7.10 Build AdminCitationForm component
    - Create `components/AdminCitationForm.tsx`
    - Implement form fields for all citation properties
    - Add form validation
    - Display success confirmation
    - Clear form after submission
    - _Requirements: 5.1, 5.5_

  - [ ]* 7.11 Write property test for citation creation confirmation
    - **Property 13: Citation creation confirmation**
    - **Validates: Requirements 5.5**

- [ ] 8. Build page components
  - [ ] 8.1 Create public homepage
    - Implement `app/page.tsx`
    - Fetch citations from DynamoDB via API
    - Render CitationGrid with CitationCard components
    - Add SearchBar component
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 8.2 Create login page
    - Implement `app/login/page.tsx`
    - Render LoginForm component
    - Handle authentication flow
    - Redirect on success
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 8.3 Create citation detail page
    - Implement `app/citations/[id]/page.tsx`
    - Protect route with authentication middleware
    - Fetch detailed citation from Aurora via API
    - Display all citation details
    - Show related citations
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ]* 8.4 Write property test for citation detail page completeness
    - **Property 6: Citation detail page completeness**
    - **Validates: Requirements 3.4**

  - [ ]* 8.5 Write property test for citation detail navigation
    - **Property 7: Citation detail navigation**
    - **Validates: Requirements 3.2**

  - [ ] 8.6 Create favorites page
    - Implement `app/favorites/page.tsx`
    - Protect route with authentication middleware
    - Fetch user favorites via API
    - Render favorites as CitationGrid
    - _Requirements: 4.4_

  - [ ] 8.7 Create admin panel page
    - Implement `app/admin/page.tsx`
    - Protect route with admin role check
    - Render AdminCitationForm component
    - _Requirements: 5.1_

- [ ] 9. Implement search functionality
  - [ ] 9.1 Integrate search with homepage
    - Connect SearchBar to search API
    - Update CitationGrid with search results
    - Handle empty search results
    - _Requirements: 6.1, 6.2, 6.5_

  - [ ]* 9.2 Write property test for search results display
    - **Property 14: Search results display as cards**
    - **Validates: Requirements 6.2**

- [ ] 10. Add error handling and loading states
  - [ ] 10.1 Implement error boundaries
    - Create error boundary components
    - Add error pages for 404 and 500
    - _Requirements: All_

  - [ ] 10.2 Add loading states
    - Create skeleton loaders for citation cards
    - Add loading spinners for forms
    - Implement optimistic UI updates for favorites
    - _Requirements: All_

- [ ] 11. Seed initial data
  - [ ] 11.1 Create database seed script
    - Write seed script to populate DynamoDB with sample citations
    - Write seed script to populate Aurora with detailed citation data
    - Include variety of authors and categories
    - _Requirements: 1.1, 1.3_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
