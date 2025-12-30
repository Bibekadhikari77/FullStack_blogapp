# BlogPlatform Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Vercel account
- Render account

## Backend Deployment (Render)

### Step 1: Prepare MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user with password
4. Whitelist all IPs (0.0.0.0/0) for production
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/blogdb`

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect GitHub repository: `Bibekadhikari77/BlogApp`
5. Configure:
   ```
   Name: blogplatform-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

6. Environment Variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogdb
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
   NODE_ENV=production
   ```

7. Click **Create Web Service**
8. Wait for deployment (5-10 minutes)
9. Copy URL: `https://blogplatform-backend.onrender.com`

### Step 3: Update CORS
Update `backend/server.js` to allow Vercel domain:
```javascript
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Frontend Deployment (Vercel)

### Method 1: Vercel Website
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import: `Bibekadhikari77/BlogApp`
5. Configure:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

6. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://blogplatform-backend.onrender.com/api
   ```

7. Click **Deploy**

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd /home/bibek/Desktop/nestjs/Blog/frontend

# Login
vercel login

# Deploy
vercel --prod

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://blogplatform-backend.onrender.com/api
```

---

## Alternative Backend Options

### Railway (Easier, Free)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select `BlogApp` repository
5. Add service → Select `backend` folder
6. Add variables (same as Render)
7. Railway provides URL automatically

### Heroku (Requires credit card)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create blogplatform-backend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set config vars
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"

# Deploy
git subtree push --prefix backend heroku main
```

---

## Post-Deployment Checklist

### Backend
- [ ] Check logs: `https://dashboard.render.com/web/YOUR_SERVICE/logs`
- [ ] Test API: `https://your-backend.onrender.com/api/auth/test`
- [ ] Verify MongoDB connection
- [ ] Check CORS settings

### Frontend
- [ ] Verify environment variables
- [ ] Test login/signup
- [ ] Test blog post creation
- [ ] Check all pages load correctly
- [ ] Test on mobile devices

### Database
- [ ] Create admin user manually in MongoDB
- [ ] Create initial categories
- [ ] Test CRUD operations

---

## Custom Domain (Optional)

### Vercel
1. Go to project settings → Domains
2. Add your domain (e.g., myblog.com)
3. Update DNS records as instructed

### Render
1. Go to service settings → Custom Domain
2. Add domain
3. Update DNS CNAME record

---

## Troubleshooting

### Backend Issues
```bash
# Check logs on Render
# Go to dashboard → Your service → Logs

# Common issues:
1. MongoDB connection failed → Check IP whitelist
2. Module not found → Verify package.json
3. Port issues → Ensure PORT=5000 in env vars
```

### Frontend Issues
```bash
# Check build logs on Vercel
# Go to deployments → Click failed deployment → View logs

# Common issues:
1. API calls fail → Check NEXT_PUBLIC_API_URL
2. Build fails → Run `npm run build` locally first
3. 404 errors → Check routing in pages/
```

### CORS Errors
Update backend `server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

---

## Free Tier Limitations

### Render
- ⚠️ **Cold starts**: App sleeps after 15 min inactivity
- ⚠️ **First request slow**: Takes 30-60 sec to wake up
- ✅ **Solution**: Use cron-job.org to ping every 14 minutes

### Vercel
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Global CDN

### MongoDB Atlas
- ✅ 512MB storage (enough for thousands of blogs)
- ✅ Shared cluster
- ✅ Auto-backups

---

## Monitoring & Maintenance

### Keep Backend Awake (Render Free Tier)
Use [cron-job.org](https://cron-job.org):
1. Create account
2. Add new cron job
3. URL: `https://your-backend.onrender.com/api/health`
4. Schedule: Every 14 minutes

### Analytics (Optional)
- Google Analytics for Vercel
- LogRocket for error tracking
- Vercel Analytics (built-in)

---

## Cost Breakdown (Free Options)

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| Render | Free | $0 | Backend hosting, auto-deploy |
| Vercel | Hobby | $0 | Frontend hosting, SSL, CDN |
| MongoDB Atlas | Free | $0 | 512MB storage |
| Cloudinary | Free | $0 | 25GB storage, 25GB bandwidth |

**Total: $0/month** ✅

---

## Production Checklist

Before going live:
- [ ] Change JWT_SECRET to random 64+ character string
- [ ] Enable MongoDB Atlas IP whitelist (or use 0.0.0.0/0)
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins
- [ ] Test all features
- [ ] Add error logging (e.g., Sentry)
- [ ] Set up backups
- [ ] Add privacy policy & terms
- [ ] Configure SEO meta tags
- [ ] Test performance (Lighthouse)

---

## Support Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Quick Deploy Commands

```bash
# Build locally to test
cd /home/bibek/Desktop/nestjs/Blog/frontend
npm run build
npm start

# Test backend
cd /home/bibek/Desktop/nestjs/Blog/backend
npm start
```

---

Good luck with your deployment! 🚀
