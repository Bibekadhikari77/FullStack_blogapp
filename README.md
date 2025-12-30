# Blog Platform

A blogging website where people can write, share, and read posts. Built with Next.js for the frontend and Node.js/Express for the backend.

## What You Can Do

**For Everyone:**
- Read blog posts
- Search and filter posts by categories or tags
- See most viewed posts

**After Signing Up:**
- Write comments on posts
- Like posts
- Create an author account to write your own posts

**As an Author:**
- Create new blog posts with a rich text editor
- Add images, categories, and tags
- Save posts as drafts or publish them
- Edit or delete your own posts

**As an Admin:**
- Manage all posts and comments
- Create categories
- See dashboard with stats
- Manage user accounts and roles

## Built With

**Backend:**
- Node.js & Express - Server
- MongoDB - Database
- JWT - Login system
- bcryptjs - Password security

**Frontend:**
- Next.js - React framework
- TypeScript - Better JavaScript
- Tailwind CSS - Styling
- React Quill - Text editor for writing posts

## What You Need

- Node.js (version 16 or newer)
- MongoDB (version 5 or newer)
- npm (comes with Node.js)

## How to Run This Project

### Step 1: Get the Code
```bash
git clone https://github.com/Bibekadhikari77/BlogApp.git
cd BlogApp
```

### Step 2: Setup Backend

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Now open the `.env` file and add your details:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog
JWT_SECRET=put-any-random-text-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

Start MongoDB if it's not running:
```bash
# On Linux:
sudo systemctl start mongod

# On Mac:
brew services start mongodb-community
```

Start the backend:
```bash
npm run dev
```

Backend will run at `http://localhost:5000`

### Step 3: Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local` and add:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

That's it! Open your browser and go to `http://localhost:3000`

## Project Structure

```
Blog/
├── backend/          # Server-side code
│   ├── controllers/  # Business logic
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & validation
│   └── server.js     # Main server file
│
└── frontend/         # Client-side code
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Website pages
    │   ├── contexts/    # Auth state
    │   └── utils/       # Helper functions
    └── public/          # Static files
```

## License

Free to use under ISC License.

## Questions?

Feel free to open an issue if you run into problems!

## Making Your First Admin Account

After the app is running, you need to create an admin:

1. Sign up normally through the website
2. Open MongoDB and run this command:

```javascript
use blog
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Now you can login as an admin!

## Common Issues

**Can't connect to MongoDB?**
- Make sure MongoDB is running
- Check your MONGODB_URI in the .env file

**Login not working?**
- Clear your browser cookies and try again
- Make sure JWT_SECRET is set in .env

**Frontend can't connect to backend?**
- Check both servers are running
- Verify the API URL in frontend .env.local matches backend port
