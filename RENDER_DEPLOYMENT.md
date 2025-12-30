# Render Deployment Guide for Backend

## Step 1: Get Cloudinary Cloud Name

1. Go to your Cloudinary dashboard: https://console.cloudinary.com/
2. Find your **Cloud Name** (e.g., `dxxxx`)
3. Copy it for later

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create account
3. Create a **FREE cluster**
4. Click **Connect** → **Connect your application**
5. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/blogdb`
6. Replace `<password>` with your actual database password
7. Go to **Network Access** → Add IP: `0.0.0.0/0` (allow all for Render)

## Step 3: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub account
5. Select repository: **BlogApp**
6. Configure:
   ```
   Name: blogplatform-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

7. Click **Advanced** and add Environment Variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/blogdb
   JWT_SECRET=make-this-a-long-random-string-64-characters-minimum-for-security
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloud_name_from_dashboard
   CLOUDINARY_API_KEY=541557191134561
   CLOUDINARY_API_SECRET=iw76Yf6av6OFRNgXX-Er-lrGVXQ
   ```

8. Click **Create Web Service**

## Step 4: Wait for Deployment

- First deployment takes 5-10 minutes
- Watch the logs for any errors
- Once complete, you'll get a URL like: `https://blogplatform-backend.onrender.com`

## Step 5: Test Your Backend

1. Open: `https://your-backend-url.onrender.com/api/health` (should return OK)
2. Test endpoints in browser or Postman

## Step 6: Update Frontend

Update your frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=https://blogplatform-backend.onrender.com/api
```

Then redeploy your frontend on Vercel.

## Important Notes

⚠️ **Free Tier Limitations:**
- App sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Use cron-job.org to ping every 14 minutes to keep awake

⚠️ **Security:**
- Change JWT_SECRET to a random 64+ character string
- Never commit .env file to GitHub
- Use strong passwords for MongoDB

✅ **Done!** Your backend is now live on Render with Cloudinary image support.

## Troubleshooting

**MongoDB Connection Failed:**
- Check IP whitelist (should have 0.0.0.0/0)
- Verify connection string format
- Ensure password has no special characters that need URL encoding

**Cloudinary Not Working:**
- Verify cloud name is correct
- Check API key and secret
- Make sure CLOUDINARY_CLOUD_NAME env var is set

**CORS Errors:**
- Add your Vercel domain to FRONTEND_URL
- Check server.js CORS configuration includes your domain

**Build Failed:**
- Check Render logs
- Verify package.json exists
- Ensure all dependencies are in package.json
