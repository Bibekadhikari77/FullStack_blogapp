# 🚀 Full-Stack Blog Platform

A modern, feature-rich blogging platform built with Next.js, Node.js, Express, and MongoDB. This project demonstrates a complete Web 2.0 application with authentication, authorization, content management, and social features.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens
- Secure password hashing with bcryptjs
- Role-based access control (Admin, Author, Reader)
- Protected routes and API endpoints
- Profile management and password change

### 📝 Blog Post Management
- Create, read, update, and delete posts
- Rich text editor for content creation
- Draft and published modes
- SEO-friendly slug generation
- Category assignment
- Multiple tags support
- Featured images
- Author tracking
- View counter
- Automatic excerpt generation

### 🏷️ Categories and Tags
- Admin-managed categories
- User-created tags
- Filter posts by category or tag
- Popular tags display

### 💬 Comment System
- Nested comments (replies)
- User authentication required
- Edit and delete own comments
- Admin moderation capabilities
- Real-time comment counts

### ❤️ Likes/Reactions
- Like and unlike posts
- Prevent duplicate likes
- Like counter per post
- User authentication required

### 🔍 Search & Filter
- Full-text search on posts
- Filter by category
- Filter by tag
- Pagination for all listings
- Sort by date

### 📊 Admin Dashboard
- User statistics and management
- Post analytics
- Comment moderation
- Most liked posts
- Most viewed posts
- Active authors tracking
- Role assignment
- User activation/deactivation

### 🎨 Frontend Features
- Responsive design with Tailwind CSS
- Server-side rendering with Next.js
- Rich text editor (React Quill)
- Real-time notifications (React Hot Toast)
- Loading states and skeletons
- Error handling
- Clean and modern UI

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP request logger

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Quill** - Rich text editor
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **date-fns** - Date formatting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Blog
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/blog-platform
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRE=7d
# FRONTEND_URL=http://localhost:3000

# Start MongoDB (if not running)
# On Ubuntu/Debian:
sudo systemctl start mongod

# On macOS with Homebrew:
brew services start mongodb-community

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local
# API_URL=http://localhost:5000/api
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Blog/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── categoryController.js # Categories
│   │   ├── commentController.js  # Comments
│   │   ├── likeController.js     # Likes
│   │   ├── postController.js     # Posts
│   │   └── tagController.js      # Tags
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── error.js              # Error handling
│   │   └── validate.js           # Input validation
│   ├── models/
│   │   ├── Category.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Post.js
│   │   ├── Tag.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── likeRoutes.js
│   │   ├── postRoutes.js
│   │   └── tagRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Footer.tsx
    │   │   ├── Layout.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Pagination.tsx
    │   │   └── PostCard.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx   # Auth state management
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   └── index.tsx     # Admin dashboard
    │   │   ├── posts/
    │   │   │   ├── [slug].tsx    # Post detail
    │   │   │   └── create.tsx    # Create post
    │   │   ├── _app.tsx
    │   │   ├── _document.tsx
    │   │   ├── index.tsx          # Home page
    │   │   ├── login.tsx
    │   │   ├── register.tsx
    │   │   └── my-posts.tsx
    │   ├── styles/
    │   │   └── globals.css
    │   └── utils/
    │       └── api.ts             # Axios instance
    ├── .env.local.example
    ├── next.config.js
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── tsconfig.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (Author, Admin)
- `PUT /api/posts/:id` - Update post (Author, Admin)
- `DELETE /api/posts/:id` - Delete post (Author, Admin)
- `GET /api/posts/user/my-posts` - Get user's posts

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/popular` - Get popular tags
- `GET /api/tags/:slug` - Get single tag
- `POST /api/tags` - Create tag (Author, Admin)
- `PUT /api/tags/:id` - Update tag (Admin)
- `DELETE /api/tags/:id` - Delete tag (Admin)

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment (Authenticated)
- `PUT /api/comments/:id` - Update comment (Owner)
- `DELETE /api/comments/:id` - Delete comment (Owner, Admin)
- `GET /api/comments` - Get all comments (Admin)
- `PUT /api/comments/:id/moderate` - Moderate comment (Admin)

### Likes
- `POST /api/likes/:postId` - Like post (Authenticated)
- `DELETE /api/likes/:postId` - Unlike post (Authenticated)
- `GET /api/likes/:postId/check` - Check if liked (Authenticated)
- `GET /api/likes/:postId/users` - Get post likes

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Activate/Deactivate user
- `DELETE /api/admin/users/:id` - Delete user

## 👥 User Roles

### Reader
- Read published posts
- Comment on posts
- Like posts
- View categories and tags

### Author
- All Reader permissions
- Create, edit, and delete own posts
- Manage drafts
- Create tags

### Admin
- All Author permissions
- Delete any post
- Manage categories
- Moderate comments
- View dashboard statistics
- Manage users
- Assign roles

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Rate limiting on auth endpoints
- Input validation
- CORS configuration
- Helmet security headers
- Environment variables for secrets
- SQL injection prevention (NoSQL)
- XSS protection

## 🎯 Getting Started

### Create an Admin User

1. Register a new user through the frontend
2. Connect to MongoDB and manually update the user's role:

```javascript
use blog-platform
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Create Categories (Admin Required)

1. Login as admin
2. Use the API or create an admin UI to add categories:

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Technology", "description": "Tech related posts"}'
```

### Create Your First Post

1. Login as an author
2. Navigate to "Create Post"
3. Fill in the details
4. Select category and tags
5. Choose "Publish" or "Save as Draft"

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check your `MONGODB_URI` in `.env`
- Verify MongoDB is accessible

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend is running on the correct port

### JWT Token Error
- Clear browser cookies
- Re-login to get a new token
- Check `JWT_SECRET` is set in `.env`

## 📝 Development Notes

### Adding New Features
1. Create model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Create routes in `backend/routes/`
4. Register routes in `server.js`
5. Create frontend components/pages
6. Update API calls in frontend

### Database Indexes
All necessary indexes are defined in the models for optimal query performance.

## 🚀 Deployment

### Backend Deployment
- Use MongoDB Atlas for database
- Deploy to Heroku, Railway, or AWS
- Set environment variables
- Update CORS settings

### Frontend Deployment
- Deploy to Vercel, Netlify, or AWS
- Set `NEXT_PUBLIC_API_URL` to production API
- Configure build settings

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ as a full-stack blog platform demonstration

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!
