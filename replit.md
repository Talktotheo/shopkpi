# replit.md

## Overview

ShopKPI is a full-stack web application designed for tracking and analyzing Key Performance Indicators (KPIs) in a print shop environment. The application allows users to submit daily KPI reports and provides administrators with comprehensive dashboard analytics and user management capabilities.

## System Architecture

The application follows a modern full-stack architecture with:
- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based authentication
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management

## Key Components

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Located in `shared/schema.ts` with two main tables:
  - `users`: User accounts with role-based access (admin/user)
  - `kpiReports`: Daily KPI submissions linked to users
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with LocalStrategy for username/password authentication
- **Session Management**: Express-session with PostgreSQL store
- **Password Security**: Scrypt-based password hashing with salt
- **API Routes**: RESTful endpoints for user management, KPI reports, and dashboard data
- **Middleware**: Request logging, JSON parsing, and authentication checks

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Authentication & Authorization
- **Authentication Strategy**: Session-based authentication using Passport.js
- **Password Security**: Scrypt hashing with random salt generation
- **Role-based Access**: Two user roles - 'admin' and 'user'
- **Protected Routes**: Client-side route protection with authentication checks
- **Session Persistence**: PostgreSQL-backed session storage

## Data Flow

1. **User Registration/Login**: Users authenticate through `/auth` page using username/password
2. **KPI Submission**: Authenticated users submit daily reports via `/submit` page
3. **Dashboard Analytics**: Users view their own data, admins can view all users' data
4. **Data Validation**: Zod schemas ensure data integrity on both client and server
5. **Real-time Updates**: TanStack Query provides optimistic updates and cache invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon Database
- **drizzle-orm**: TypeScript ORM for database operations
- **passport**: Authentication middleware for Node.js
- **express-session**: Session management middleware
- **@tanstack/react-query**: Data fetching and caching library
- **react-hook-form**: Form state management and validation
- **zod**: Schema validation library

### UI Dependencies
- **@radix-ui/***: Accessible UI primitive components
- **tailwindcss**: Utility-first CSS framework
- **recharts**: React charting library
- **lucide-react**: Icon library
- **date-fns**: Date utility library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Build Process
- **Frontend Build**: Vite bundles React application to `dist/public`
- **Backend Build**: esbuild compiles server TypeScript to `dist/index.js`
- **Database Migrations**: Drizzle Kit manages database schema migrations

### Runtime Configuration
- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Production**: `npm run start` serves the built application
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Sessions**: Requires `SESSION_SECRET` environment variable for session security

### Replit Configuration
- **Modules**: Node.js 20, web server, and PostgreSQL 16
- **Ports**: Application runs on port 5000, exposed as port 80
- **Autoscale**: Configured for automatic scaling deployment

## Recent Changes
- June 25, 2025: Updated KPI tracking system to job-based reporting
  - Removed "Jobs Completed" metric
  - Added job name and job number fields to track individual jobs
  - Changed "Hours Worked" to "Time on Job" with 15-minute increment dropdown
  - Updated dashboard to show job-level details in admin view
  - Order accuracy now automatically calculated from prints and misprints
  - Admin can view all completed jobs by day and user in jobs table

## User Preferences

Preferred communication style: Simple, everyday language.