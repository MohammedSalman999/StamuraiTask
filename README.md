# StamuraiTask
# Task Management System 🚀

A full-stack role-based task management platform with dashboards for Admin, Moderator, and User roles. Built with Next.js, Express.js, and MongoDB.


## Key Features ✨
- **Role-Based Access Control**
  - Admin: System overview & analytics
  - Moderator: Task assignment & tracking
  - User: Task execution & status updates
- **Interactive Dashboards** 📊
- **Excel Export** 📥 for all task types
- **Real-time Data Refresh** 🔄 (30s interval)
- **File Upload Integration** ☁️ (Cloudinary)
- **JWT Authentication** 🔒
- **Animated UI Components** 🎨
- **Dark/Light Mode** 🌓

## Tech Stack 💻
**Frontend:** 
- Next.js 13, React Hook Form, Zod 
- Shadcn UI, Framer Motion, XLSX

**Backend:** 
- Express.js, MongoDB, Mongoose 
- JWT, Cloudinary, Bcrypt

## Setup Instructions ⚙️

1. **Clone Repository**

git clone https://github.com/MohammedSalman999/StamuraiTask.git
Install Dependencies

bash
cd client && npm install
cd ../server && npm install
Environment Variables (.env)

env
# Server
MONGODB_URI=mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client
NEXT_PUBLIC_API_URL=http://localhost:5000
Run Application

bash
# Start backend
cd server && npm start

# Start frontend
cd client && npm run dev
System Architecture 🏗️
Backend Layers:

Models (userModels.js, taskModels.js)

User schema with role-based permissions

Task schema with status tracking

Controllers

Admin: Aggregation pipelines for analytics

Moderator: Task assignment logic

User: Task completion workflows

Routes

Role-specific endpoints with JWT protection

File upload handling with Multer

Middleware

Async error handling

JWT verification

Role validation

Frontend Structure:

Dynamic routing based on user role

Animated dashboard components

Form validation with Zod

Excel export functionality

Key Implementation Details 🔍
Error Handling
javascript
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
  }
}
Success Response
javascript
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode < 400;
  }
}
Secure File Upload
javascript
const uploadOnCloudinary = async (localFilePath) => {
  // Encryption & temp file cleanup
  const response = await cloudinary.uploader.upload(localFilePath);
  await fs.unlink(localFilePath);
  return response;
};
Trade-offs & Assumptions ⚖️
Authentication:

Using localStorage for JWT (secure cookies preferred for production)

No email verification/password recovery

Performance:

Basic pagination vs infinite scroll

30s polling vs WebSockets for real-time updates

Security:

Role validation at route level vs middleware

Basic error messages for client

Scalability:

MongoDB aggregations vs dedicated analytics DB

Single server setup vs microservices

Future Improvements 🔮
Add real-time notifications

Implement task comments/threads

Add user performance metrics

Develop mobile app version

Integrate SSO options
