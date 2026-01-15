# Deploy to Vercel - Step by Step Guide

## Quick Deploy (5 minutes)

### Step 1: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In"
   - Sign in with your **GitHub account** (recommended)

2. **Import Your Project:**
   - Click "Add New Project" or "Import Project"
   - You'll see a list of your GitHub repositories
   - Find and select: `thakurnischay/investment-dashboard-`
   - Click "Import"

3. **Configure Project Settings:**
   - **Framework Preset**: Select `Vite` (or it may auto-detect)
   - **Root Directory**: Click "Edit" and set to `frontend`
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. **Add Environment Variable:**
   - Scroll down to "Environment Variables"
   - Click "Add" and add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://your-backend-url.onrender.com/api` 
     - ⚠️ **Note**: You'll need to deploy backend first, or use a placeholder and update later

5. **Deploy:**
   - Click "Deploy" button
   - Wait 2-3 minutes for build to complete
   - Once deployed, you'll get a URL like: `https://investment-dashboard-xxxxx.vercel.app`

### Step 2: Deploy Backend (Required for Full Functionality)

Since Vercel is primarily for frontend, deploy backend to **Render** or **Railway**:

#### Option A: Render (Recommended - Free)

1. **Go to Render:**
   - Visit https://render.com
   - Sign up/Login with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `thakurnischay/investment-dashboard-`

3. **Configure:**
   - **Name**: `investment-dashboard-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: Leave empty

4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your-super-secret-key-min-32-chars
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Copy your backend URL

6. **Update Frontend:**
   - Go back to Vercel dashboard
   - Go to your project → Settings → Environment Variables
   - Update `VITE_API_BASE_URL` with your Render backend URL
   - Redeploy (Vercel will auto-redeploy or click "Redeploy")

#### Option B: Railway (Alternative)

1. Visit https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repository
5. Add environment variables (same as Render)
6. Deploy

### Step 3: Set Up MongoDB Atlas

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select a cloud provider and region
   - Click "Create"

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern_investments?retryWrites=true&w=majority`

4. **Whitelist IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For testing, add `0.0.0.0/0` (allows all IPs)
   - For production, add specific IPs

5. **Update Backend:**
   - Use this connection string in your backend environment variables

## Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] Frontend URL updated in backend CORS
- [ ] Backend URL updated in frontend env vars
- [ ] Test login/registration
- [ ] Test dashboard functionality

## Testing After Deployment

1. **Test Frontend:**
   - Visit your Vercel URL
   - Should see login page

2. **Test Backend:**
   - Visit: `https://your-backend-url.com/`
   - Should see: `{"status":"OK","message":"MERN investment API running"}`

3. **Test Full Flow:**
   - Register a user (via API or create manually)
   - Login through frontend
   - Check if dashboard loads

## Troubleshooting

### Frontend Issues

- **Build Fails**: Check Vercel build logs for errors
- **API Not Connecting**: Verify `VITE_API_BASE_URL` is correct
- **404 Errors**: Vercel should handle routing automatically with the vercel.json config

### Backend Issues

- **MongoDB Connection Error**: 
  - Check connection string format
  - Ensure IP is whitelisted in MongoDB Atlas
  - Check username/password are correct
- **CORS Error**: 
  - Ensure `FRONTEND_URL` matches your Vercel URL exactly
  - No trailing slash

### Common Issues

- **Slow First Load**: Render free tier spins down after inactivity
- **Environment Variables Not Working**: 
  - Ensure variables are set in platform settings
  - Redeploy after adding variables
- **Build Timeout**: 
  - Check if all dependencies are in package.json
  - Check build logs for specific errors

## Your Deployment URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-api.onrender.com` or `https://your-api.railway.app`

## Next Steps

1. Set up custom domain (optional)
2. Enable analytics
3. Set up monitoring
4. Configure CI/CD for auto-deployment
