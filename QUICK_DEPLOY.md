# 🚀 Quick Deploy Guide - Vercel Frontend

## ⚡ Fastest Method: Web Interface (Recommended - 5 minutes)

### Frontend Deployment to Vercel

1. **Go to Vercel:**
   ```
   https://vercel.com
   ```

2. **Sign In:**
   - Click "Sign Up" or "Log In"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your repositories

3. **Import Project:**
   - Click "Add New Project" button
   - Find: `thakurnischay/investment-dashboard-`
   - Click "Import"

4. **Configure (IMPORTANT):**
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: Click "Edit" → Type: `frontend` → Click "Continue"
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Environment Variables:**
   - Scroll to "Environment Variables"
   - Click "Add"
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - ⚠️ **Note**: For now, use a placeholder like `http://localhost:5000/api` and update after backend deployment

6. **Deploy:**
   - Click "Deploy" button
   - Wait 2-3 minutes
   - ✅ You'll get a URL like: `https://investment-dashboard-xxxxx.vercel.app`

### Backend Deployment (Required)

**You need to deploy backend separately. Choose one:**

#### Option 1: Render (Free, Recommended)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository: `thakurnischay/investment-dashboard-`
5. Configure:
   - Name: `investment-dashboard-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-32-chars-min
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
7. Click "Create Web Service"
8. Wait 5-10 minutes
9. Copy backend URL

10. **Update Frontend:**
    - Go back to Vercel dashboard
    - Your Project → Settings → Environment Variables
    - Edit `VITE_API_BASE_URL` with your Render backend URL
    - Go to Deployments → Click "..." → "Redeploy"

#### Option 2: Railway

1. Go to: https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select repository
5. Add same environment variables as Render
6. Deploy

### MongoDB Setup

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free tier)
3. Create cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your password
7. Add to backend environment variables as `MONGO_URI`
8. Go to "Network Access" → Add IP `0.0.0.0/0` (for testing)

## 📋 Deployment Checklist

- [ ] Frontend deployed to Vercel ✅
- [ ] Backend deployed to Render/Railway
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set in both platforms
- [ ] Frontend URL added to backend CORS
- [ ] Backend URL added to frontend env vars
- [ ] Test the application

## 🧪 Test Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Visit `https://your-backend-url.com/` (should show API status)
3. **Full Test**: Try logging in/registering

## 🔧 Troubleshooting

**Frontend not connecting to backend?**
- Check `VITE_API_BASE_URL` in Vercel settings
- Ensure backend is deployed and running
- Check browser console for errors

**Backend CORS errors?**
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- No trailing slashes

**MongoDB connection failed?**
- Check connection string format
- Ensure IP is whitelisted in MongoDB Atlas
- Check username/password

## 📞 Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Check platform logs for errors
- Verify all environment variables are set
