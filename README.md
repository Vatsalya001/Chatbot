# Comment App - Highly Scalable Comment System

A modern, highly scalable comment application built with **backend focus**, emphasizing performance, clean architecture, and Docker-based containerization. The system supports nested comments, user authentication, real-time notifications, and implements a 15-minute grace period for editing and deleting comments.

## 🎯 Core Features

### 🔐 Authentication System
- **Secure JWT-based authentication** with access & refresh tokens
- User registration and login with proper validation
- Password hashing using bcrypt with salt rounds
- Session management with automatic token refresh
- User profile management

### 💬 Advanced Comment System
- **Multi-level nested comments** with unlimited depth
- **Materialized path** for efficient nested comment queries
- **15-minute edit window** - comments can only be edited within 15 minutes of posting
- **15-minute delete/restore window** - comments can be deleted and restored within 15 minutes
- Soft deletes with grace period restoration
- Comment threading and reply functionality
- Content versioning (original content preserved on edit)

### 🔔 Smart Notification System
- Real-time notifications when users receive replies
- **Read/Unread status toggle** functionality
- Notification metadata for rich content
- Different notification types (replies, mentions, system)
- User notification preferences

### ⚡ Performance & Scalability
- **Redis caching** for improved performance
- **Database connection pooling** with optimized settings
- **Rate limiting** to prevent abuse
- **Pagination** for large datasets
- **Database indexing** for optimal query performance
- Efficient nested comment retrieval using path-based queries

## 🏗️ Architecture

### Backend (NestJS + TypeScript)
```
backend/
├── src/
│   ├── config/           # Configuration management
│   ├── modules/
│   │   ├── auth/         # Authentication (JWT, guards, strategies)
│   │   ├── users/        # User management
│   │   ├── comments/     # Comment system with nesting
│   │   ├── notifications/# Notification system
│   │   └── health/       # Health checks
│   ├── common/           # Shared utilities, guards, decorators
│   └── main.ts           # Application bootstrap
```

### Frontend (Next.js + TypeScript)
```
frontend/
├── app/                  # Next.js 13+ app directory
├── components/           # Reusable UI components
├── lib/                  # Utilities and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

### Database Schema (PostgreSQL)
```sql
-- Users table with authentication and profile data
users (id, username, email, password, firstName, lastName, avatar, isActive, isEmailVerified, lastLoginAt, createdAt, updatedAt)

-- Comments with nested structure using materialized path
comments (id, content, originalContent, isEdited, editedAt, isDeleted, deletedAt, restoredAt, depth, childrenCount, path, authorId, parentId, createdAt, updatedAt)

-- Notifications for user interactions
notifications (id, type, title, message, isRead, readAt, metadata, userId, commentId, triggeredById, createdAt, updatedAt)
```

## 🚀 Tech Stack

### Backend
- **NestJS** - Scalable Node.js framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Primary database
- **TypeORM** - Database ORM with migrations
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **class-validator** - Request validation
- **Helmet** - Security headers
- **Compression** - Response compression

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **Multi-stage builds** - Optimized production images
- **Health checks** - Container monitoring
- **Non-root users** - Security best practices

## 🐳 Docker Setup

### Quick Start
```bash
# Clone and start the entire application
git clone <repository-url>
cd comment-app

# Build and start all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Services
- **PostgreSQL** (port 5432) - Primary database
- **Redis** (port 6379) - Caching layer
- **Backend API** (port 3001) - NestJS application
- **Frontend** (port 3000) - Next.js application

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/comment_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📊 API Documentation

Once the backend is running, access the interactive API documentation:
- **Swagger UI**: http://localhost:3001/api/docs

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens

#### Comments
- `GET /api/comments` - List comments with pagination
- `POST /api/comments` - Create new comment
- `GET /api/comments/:id` - Get comment with nested replies
- `PUT /api/comments/:id` - Edit comment (15-minute window)
- `DELETE /api/comments/:id` - Delete comment (15-minute window)
- `POST /api/comments/:id/restore` - Restore deleted comment

#### Notifications
- `GET /api/notifications` - List user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/:id/unread` - Mark as unread

## 🏃‍♂️ Usage Examples

### Creating a Nested Comment
```javascript
// Create a top-level comment
const comment = await fetch('/api/comments', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>' },
  body: JSON.stringify({
    content: 'This is a top-level comment'
  })
});

// Reply to the comment
const reply = await fetch('/api/comments', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>' },
  body: JSON.stringify({
    content: 'This is a reply',
    parentId: comment.id
  })
});
```

### Edit Comment (Within 15 Minutes)
```javascript
const updatedComment = await fetch(`/api/comments/${commentId}`, {
  method: 'PUT',
  headers: { 'Authorization': 'Bearer <token>' },
  body: JSON.stringify({
    content: 'Updated comment content'
  })
});
```

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Rate limiting** to prevent API abuse
- **Input validation** and sanitization
- **CORS** protection
- **Helmet** security headers
- **SQL injection** prevention via TypeORM
- **XSS protection** through input validation
- **Non-root Docker containers**

## 📈 Performance Optimizations

### Backend
- **Connection pooling** (max: 20, min: 5 connections)
- **Redis caching** for frequently accessed data
- **Database indexing** on foreign keys and search fields
- **Efficient nested queries** using materialized paths
- **Response compression**
- **Query optimization** with proper joins and pagination

### Frontend
- **Next.js optimization** with SSR/SSG
- **Image optimization** with Next.js Image component
- **Code splitting** for smaller bundle sizes
- **React Query** for efficient data fetching and caching

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:e2e
npm run test:cov

# Frontend tests
cd frontend
npm test
npm run test:watch
```

## 🚀 Production Deployment

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
- Update JWT secrets to strong, random values
- Configure production database connection
- Set up proper Redis instance
- Configure reverse proxy (nginx/Apache)
- Set up SSL certificates
- Configure monitoring and logging

## 📝 Key Business Rules

1. **15-Minute Edit Window**: Comments can only be edited within 15 minutes of creation
2. **15-Minute Delete/Restore Window**: Comments can be deleted and restored within 15 minutes
3. **Nested Replies**: Unlimited nesting depth for threaded conversations
4. **Soft Deletes**: Deleted comments show as "[Comment deleted]" but preserve thread structure
5. **Automatic Notifications**: Users receive notifications when someone replies to their comments
6. **Authentication Required**: All comment operations require user authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the Docker logs: `npm run docker:logs`

---

**Built with ❤️ focusing on backend performance, scalability, and clean architecture.**