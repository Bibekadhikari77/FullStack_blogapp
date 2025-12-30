# 📦 Installation & Running Instructions

## Quick Installation (Fastest Method)

### Option 1: Automated Setup Script (Recommended)

```bash
# Navigate to project root
cd /home/bibek/Desktop/nestjs/Blog

# Run the setup script
./setup.sh

# The script will:
# ✅ Check prerequisites
# ✅ Install backend dependencies
# ✅ Install frontend dependencies
# ✅ Create .env files from examples
```

### Option 2: Manual Installation

#### Backend:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your settings
```

#### Frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if needed (default settings should work)
```

---

## 🚀 Running the Application

### Step 1: Start MongoDB

**Ubuntu/Debian:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod  # Verify it's running
```

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
- MongoDB should auto-start, or use MongoDB Compass

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
========================================
🚀 Server running in development mode
📍 Port: 5000
🌐 URL: http://localhost:5000
📚 API: http://localhost:5000/api
========================================
MongoDB Connected Successfully
```

### Step 3: Start Frontend Server (New Terminal)

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## ✅ Verify Installation

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Open Frontend
Navigate to: http://localhost:3000

You should see the blog platform home page.

### 3. Test Registration
1. Go to http://localhost:3000/register
2. Create an account with role "author"
3. You should be redirected to home page after registration

---

## 🔧 Initial Configuration

### 1. Create Admin User

After registering your first user, make them admin:

```bash
# Connect to MongoDB
mongosh blog-platform

# Update user role to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.findOne({ email: "your-email@example.com" })

# Exit
exit
```

### 2. Create Categories (Required for posting)

**Method 1: Using curl (get token from login first)**

Login to get your JWT token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"yourpassword"}'
```

Copy the token, then create categories:
```bash
# Replace YOUR_JWT_TOKEN with the actual token
TOKEN="YOUR_JWT_TOKEN"

# Create Technology category
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Technology","description":"Tech articles and tutorials"}'

# Create Lifestyle category
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Lifestyle","description":"Life and style articles"}'

# Create Business category
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Business","description":"Business and entrepreneurship"}'

# Create Education category
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Education","description":"Learning and education"}'
```

**Method 2: Using MongoDB directly**

```bash
mongosh blog-platform

# Get your admin user ID
const adminUser = db.users.findOne({ email: "your-email@example.com" })

# Create categories
db.categories.insertMany([
  {
    name: "Technology",
    slug: "technology",
    description: "Tech articles and tutorials",
    createdBy: adminUser._id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Life and style articles",
    createdBy: adminUser._id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Business",
    slug: "business",
    description: "Business and entrepreneurship",
    createdBy: adminUser._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

# Verify
db.categories.find()
exit
```

---

## 🎮 Testing the Platform

### 1. Create Your First Post

1. Login as author/admin
2. Click "Create Post" in the navbar
3. Fill in:
   - Title: "Welcome to My Blog"
   - Content: Use the rich text editor
   - Category: Select "Technology"
   - Status: "Published"
4. Click "Publish Post"

### 2. Test Comments

1. Open your post
2. Write a comment
3. Reply to your comment
4. Try editing/deleting

### 3. Test Likes

1. Click the heart icon on a post
2. Refresh - like count should persist
3. Click again to unlike

### 4. Test Search & Filter

1. Use the search bar on home page
2. Click on category in sidebar
3. Click on tags

### 5. Access Admin Dashboard

1. Login as admin
2. Navigate to http://localhost:3000/admin
3. View statistics and manage users

---

## 📊 Sample Data (Optional)

Want to quickly populate with sample data? Run this in MongoDB:

```javascript
mongosh blog-platform

// Create sample tags
db.tags.insertMany([
  { name: "javascript", slug: "javascript" },
  { name: "react", slug: "react" },
  { name: "nodejs", slug: "nodejs" },
  { name: "mongodb", slug: "mongodb" }
])

// Get category and user IDs
const techCategory = db.categories.findOne({ slug: "technology" })
const author = db.users.findOne({ role: "author" })
const jsTag = db.tags.findOne({ slug: "javascript" })

// Create sample post
db.posts.insertOne({
  title: "Getting Started with Next.js",
  slug: "getting-started-with-nextjs-" + Date.now(),
  content: "<h2>Introduction</h2><p>Next.js is an amazing React framework...</p>",
  excerpt: "Learn how to get started with Next.js in this comprehensive guide.",
  author: author._id,
  category: techCategory._id,
  tags: [jsTag._id],
  status: "published",
  views: 100,
  likesCount: 15,
  commentsCount: 5,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🔍 Verification Checklist

After setup, verify these work:

- [ ] Backend responds at http://localhost:5000/health
- [ ] Frontend loads at http://localhost:3000
- [ ] Can register a new user
- [ ] Can login
- [ ] Can view posts (even if empty)
- [ ] Admin can access dashboard at /admin
- [ ] Author can access "Create Post"
- [ ] Categories exist (verify in admin or MongoDB)

---

## 🛑 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env
PORT=5001
```

### Issue: "Cannot find module"
**Solution:**
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

### Issue: "CORS error in browser"
**Solution:**
- Check FRONTEND_URL in backend/.env matches your frontend URL
- Restart both servers

### Issue: "JWT token invalid"
**Solution:**
- Clear browser cookies
- Login again
- Check JWT_SECRET is set in backend/.env

---

## 📝 Next Steps

Once installation is complete:

1. ✅ Create admin user
2. ✅ Create categories
3. ✅ Register author accounts
4. ✅ Create your first post
5. ✅ Test all features
6. ✅ Customize as needed

---

## 📚 Additional Resources

- **Full Documentation**: [README.md](README.md)
- **API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Features List**: [FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md)

---

## 🎉 Success!

If you see:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected
- ✅ Can login and navigate

**Congratulations! Your blog platform is ready! 🚀**

Enjoy building your blogging empire! 💪
