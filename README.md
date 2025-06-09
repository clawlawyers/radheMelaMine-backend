# Node.js Authentication API with Proxy Server

A Node.js Express server that provides authentication functionality with JWT tokens and acts as a proxy for FastAPI backend routes.

## Features

- 🔐 **User Authentication**: JWT-based authentication system
- 👤 **User Management**: Registration, login, profile management
- 🔒 **Password Security**: Bcrypt password hashing
- 🛡️ **Middleware Protection**: Route protection with authentication middleware
- 📡 **Proxy Functionality**: Forward requests to FastAPI backend
- 🌱 **Database Seeding**: Sample users for testing
- ⚡ **MongoDB Integration**: Mongoose ODM for database operations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nodejs-auth-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nodejs_auth_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
BASE_URL=http://74.225.190.5:8000
```

4. Start MongoDB service (if running locally)

5. Seed the database with sample users:

```bash
npm run seed
```

6. Start the server:

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes

#### 1. User Registration

- **POST** `/api/auth/signup`
- **Description**: Register a new user
- **Body**:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### 2. User Login

- **POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get User Profile

- **GET** `/api/auth/profile`
- **Description**: Get current user's profile information
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**:

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### 4. Update User Profile

- **PUT** `/api/auth/profile`
- **Description**: Update user's profile information
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:

```json
{
  "username": "new_username",
  "email": "new_email@example.com"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "new_username",
      "email": "new_email@example.com",
      "role": "user",
      "isActive": true
    }
  }
}
```

#### 5. Change Password

- **PUT** `/api/auth/change-password`
- **Description**: Change user's password
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:

```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Proxy Routes (FastAPI Backend)

The following routes are proxied to the FastAPI backend:

- **GET** `/` - Read Root
- **POST** `/update_order_status` - Update Order Status
- **POST** `/submit_feedback` - Submit Feedback
- **GET** `/list_csv_links` - List CSV Links
- **POST** `/update_csv_file` - Update CSV File
- **GET** `/get_order_details` - Get Order Details

### Utility Routes

#### Health Check

- **GET** `/health`
- **Description**: Check server status
- **Response**:

```json
{
  "status": "OK",
  "message": "Node.js proxy server is running",
  "backend_url": "http://74.225.190.5:8000",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Sample Users

After running `npm run seed`, the following test users will be available:

### Regular User

- **Email**: `john.doe@example.com`
- **Password**: `password123`
- **Role**: `user`

### Admin User

- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin`

## Authentication Usage

### Making Authenticated Requests

1. First, login to get a JWT token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

2. Use the token in subsequent requests:

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Token Format

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional array for validation errors
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Project Structure

```
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User model schema
├── routes/
│   └── auth.js              # Authentication routes
├── seeders/
│   └── userSeeder.js        # Database seeding script
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── server.js               # Main server file
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error handling and logging
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-restart
- `npm run seed` - Seed database with sample users

### Environment Setup

Make sure to:

1. Update the `JWT_SECRET` in production
2. Configure proper MongoDB connection string
3. Set appropriate CORS policies for production
4. Configure proper logging for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
