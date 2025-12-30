# 🎯 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v16+) installed
- ✅ MongoDB (v5+) installed and running
- ✅ npm or yarn installed

## Quick Setup (Recommended)

### 1. Run the setup script (Linux/Mac):
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Start MongoDB:
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

### 3. Start the backend:
```bash
cd backend
npm run dev
```

### 4. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

### 5. Open your browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Manual Setup

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if needed
npm run dev
```

## First Time Setup

### 1. Create Admin User

Register a user at http://localhost:3000/register, then update their role in MongoDB:

```bash
mongosh blog-platform
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 2. Create Categories (Required)

Login as admin, then create categories via API:

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Technology",
    "description": "Tech related posts"
  }'
```

Or create multiple categories at once:

```bash
# Technology
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Technology", "description": "Tech articles and tutorials"}'

# Lifestyle
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Lifestyle", "description": "Life and style articles"}'

# Business
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Business", "description": "Business and entrepreneurship"}'
```

### 3. Test the Platform

1. **Register as Author**: Create a new account with "author" role
2. **Create a Post**: Navigate to "Create Post" and publish your first article
3. **Test Comments**: Login and comment on posts
4. **Test Likes**: Like posts while logged in
5. **Admin Dashboard**: Access http://localhost:3000/admin as admin

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Common Issues

### MongoDB Not Starting
```bash
# Check status
sudo systemctl status mongod

# Start manually
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Verify FRONTEND_URL in backend/.env matches your frontend URL
- Restart both servers after changing environment variables

## Testing Features

### Test User Roles
1. **Reader**: Can view posts, comment, and like
2. **Author**: Can create, edit, delete own posts
3. **Admin**: Full access to all features

### Test API Endpoints
Use the API_DOCUMENTATION.md file for complete endpoint reference.

Example using curl:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get posts
curl http://localhost:5000/api/posts

# Create post (requires auth token)
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "<p>Hello World!</p>",
    "category": "CATEGORY_ID",
    "status": "published"
  }'
```

## Development Tips

### Backend Hot Reload
Uses nodemon for automatic restart on file changes

### Frontend Hot Reload
Next.js automatically reloads on file changes

### Database GUI
Use MongoDB Compass to visualize your data:
```
mongodb://localhost:27017/blog-platform
```

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use MongoDB Atlas for database
3. Deploy to Heroku, Railway, or AWS
4. Set secure JWT_SECRET
5. Configure CORS for production domain

### Frontend
1. Build: `npm run build`
2. Deploy to Vercel or Netlify
3. Set NEXT_PUBLIC_API_URL to production API
4. Configure environment variables

## Need Help?

- 📚 Check [README.md](README.md) for detailed documentation
- 📖 See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- 🐛 Check troubleshooting section in README.md

## Success! 🎉

If everything is working:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected
- ✅ Can register and login users
- ✅ Can create and view posts

Enjoy your blog platform! 🚀
