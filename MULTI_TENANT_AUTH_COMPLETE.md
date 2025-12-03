# Multi-Tenant Organization Authentication System

## Overview
Complete implementation of a multi-tenant authentication system with:
- Organization-level data isolation
- Role-based access control (Admin, Manager, User)
- JWT authentication
- Audit logging for all actions
- PostgreSQL database with proper relationships

## Database Schema

### Tables Created
1. **organizations** - Tenant/organization data
2. **user_auth** - Users with organization association
3. **whatsapp_chats** - Chat data with organization isolation
4. **audit_logs** - Complete audit trail of all actions

### Relationships
- One organization → Many users
- One organization → Many chats
- One user → Many chats (created by)
- All data scoped to organization_id

## Backend Implementation

### Files Created

#### Models
- `/models/organization.go` - Organization entity
- `/models/user_auth.go` - User authentication entity
- `/models/whatsapp_chat.go` - Chat data entity
- `/models/audit_log.go` - Audit logging entity

#### Middleware
- `/middleware/auth.go` - JWT authentication and authorization
  - Token generation
  - Token validation
  - Role-based access control
  - Context management
  - CORS handling

#### Controllers
- `/controllers/multi_tenant_auth_controller.go` - Authentication endpoints
  - POST `/api/v2/auth/signup` - Create organization + admin user
  - POST `/api/v2/auth/login` - User login
  - GET `/api/v2/auth/me` - Get current user (requires auth)
  - POST `/api/v2/auth/logout` - Logout (requires auth)

#### Database
- `/migrations/001_multi_tenant_auth.sql` - Complete schema with indexes

## Setup Instructions

### 1. Run Database Migration

```bash
cd /Users/prasadhajare/Prasad_dev/whats_app_dev/msg-canvas-flow-main/go_server/mongo_golang

# Connect to your PostgreSQL database and run:
psql -U your_user -d your_database -f migrations/001_multi_tenant_auth.sql
```

### 2. Install Go Dependencies

```bash
# Make sure you have the required dependencies
go get github.com/google/uuid
go get golang.org/x/crypto/bcrypt
go get github.com/golang-jwt/jwt/v5

# Install all dependencies
go mod tidy
```

### 3. Set Environment Variables

Create or update `.env` file:

```bash
# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database connection (if not already set)
DATABASE_URL=postgres://user:password@localhost:5432/whatsapp_saas?sslmode=disable
```

### 4. Update main.go

Add the new routes to your main.go file. You need to:

1. Import the new controller and middleware:
```go
import (
    "mongo_golang/controllers"
    "mongo_golang/middleware"
)
```

2. Add the routes after your database connection:
```go
// Create multi-tenant auth controller
authController := controllers.NewMultiTenantAuthController(postgresDB)

// Setup CORS middleware
http.Handle("/api/v2/", middleware.CORS(http.DefaultServeMux))

// Public routes (no authentication required)
http.HandleFunc("/api/v2/auth/signup", authController.Signup)
http.HandleFunc("/api/v2/auth/login", authController.Login)

// Protected routes (authentication required)
http.Handle("/api/v2/auth/me", middleware.AuthMiddleware(http.HandlerFunc(authController.GetCurrentUser)))
http.Handle("/api/v2/auth/logout", middleware.AuthMiddleware(http.HandlerFunc(authController.Logout)))
```

## API Documentation

### 1. Signup (Create Organization + Admin User)

**Endpoint:** `POST /api/v2/auth/signup`

**Request Body:**
```json
{
  "organization_name": "My Company",
  "name": "John Doe",
  "email": "john@mycompany.com",
  "password": "securepassword123"
}
```

**Response:** (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@mycompany.com",
    "name": "John Doe",
    "role": "admin",
    "organization_id": "660e8400-e29b-41d4-a716-446655440000",
    "organization_name": "My Company"
  }
}
```

### 2. Login

**Endpoint:** `POST /api/v2/auth/login`

**Request Body:**
```json
{
  "email": "john@mycompany.com",
  "password": "securepassword123"
}
```

**Response:** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@mycompany.com",
    "name": "John Doe",
    "role": "admin",
    "organization_id": "660e8400-e29b-41d4-a716-446655440000",
    "organization_name": "My Company",
    "last_login": "2025-12-03T10:30:00Z"
  }
}
```

### 3. Get Current User

**Endpoint:** `GET /api/v2/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@mycompany.com",
    "name": "John Doe",
    "role": "admin",
    "organization_id": "660e8400-e29b-41d4-a716-446655440000",
    "organization_name": "My Company",
    "is_active": true,
    "last_login": "2025-12-03T10:30:00Z"
  }
}
```

### 4. Logout

**Endpoint:** `POST /api/v2/auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** (200 OK)
```json
{
  "message": "logged out successfully"
}
```

## Testing Instructions

### 1. Test Signup (Create First Organization)

```bash
curl -X POST http://localhost:8080/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "organization_name": "Test Org 1",
    "name": "Admin User",
    "email": "admin@testorg1.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 2. Test Login

```bash
curl -X POST http://localhost:8080/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@testorg1.com",
    "password": "password123"
  }'
```

### 3. Test Get Current User

```bash
TOKEN="your-token-here"

curl -X GET http://localhost:8080/api/v2/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Logout

```bash
curl -X POST http://localhost:8080/api/v2/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Test Multi-Tenant Isolation

Create a second organization:

```bash
curl -X POST http://localhost:8080/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "organization_name": "Test Org 2",
    "name": "Another Admin",
    "email": "admin@testorg2.com",
    "password": "password456"
  }'
```

Verify that users from Org 1 cannot access Org 2 data (this will be enforced when you add WhatsApp and user management endpoints).

## Security Features

### 1. Password Security
- Bcrypt hashing with default cost factor (10)
- Minimum 8 character password requirement
- Passwords never returned in API responses

### 2. JWT Security
- HS256 signing algorithm
- 24-hour token expiration
- Tokens include user_id, organization_id, role, email
- Middleware validates signature and expiration

### 3. Data Isolation
- All queries filter by organization_id
- Middleware automatically extracts org_id from JWT
- No cross-organization data access possible

### 4. Audit Logging
- Every authentication action logged
- IP address and User-Agent tracked
- Timestamps for all actions
- Cannot be modified (insert-only table)

## Role-Based Access Control

### Roles
1. **admin** - Full access to organization data and user management
2. **manager** - Read/write access to data, no user management
3. **user** - Basic read/write access

### Usage Example
```go
// Protect an endpoint for admin only
http.Handle("/api/v2/users", 
    middleware.AuthMiddleware(
        middleware.RequireRole("admin")(
            http.HandlerFunc(yourHandler)
        )
    )
)

// Protect for admin or manager
http.Handle("/api/v2/chats", 
    middleware.AuthMiddleware(
        middleware.RequireRole("admin", "manager")(
            http.HandlerFunc(yourHandler)
        )
    )
)
```

## Next Steps

### 1. User Management Endpoints (Admin Only)
- GET `/api/v2/users` - List users in organization
- POST `/api/v2/users` - Create new user
- PUT `/api/v2/users/:id` - Update user
- DELETE `/api/v2/users/:id` - Deactivate user

### 2. WhatsApp Chat Endpoints (Organization Isolated)
- GET `/api/v2/chats` - List chats (organization filtered)
- POST `/api/v2/chats` - Create chat
- GET `/api/v2/chats/:id` - Get chat details
- DELETE `/api/v2/chats/:id` - Delete chat (admin/manager only)

### 3. Audit Log Endpoints (Admin Only)
- GET `/api/v2/audit` - View audit logs
- Filter by user, action, date range

### 4. Frontend Integration
- Create React components for Login/Signup
- Setup Zustand store for authentication state
- Add API client with automatic token handling
- Create protected routes

## Troubleshooting

### Error: "email already registered"
- Email must be unique across all organizations
- Use a different email address

### Error: "invalid token"
- Token may be expired (24-hour validity)
- Token may be malformed
- Login again to get a new token

### Error: "insufficient permissions"
- User role doesn't have access to the endpoint
- Check role requirements in documentation

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists
- Run migrations if tables don't exist

## Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/TLS
- [ ] Set up proper CORS allowed origins
- [ ] Implement rate limiting
- [ ] Add password complexity requirements
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Set up monitoring and alerting
- [ ] Regular audit log reviews
- [ ] Database backups
- [ ] Implement refresh tokens

## Support

For issues or questions:
1. Check audit logs for authentication failures
2. Verify database connectivity
3. Check server logs for detailed error messages
4. Ensure all migrations have been run

---

**Created:** December 3, 2025  
**Status:** Implementation Complete - Ready for Testing
