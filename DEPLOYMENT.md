# Deployment Guide

This guide will help you deploy the MERN Stack Investment Dashboard to production.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get your connection string

2. **GitHub Account** (for deployment)

## Deployment Options

### Option 1: Render (Recommended for Backend) + Vercel/Netlify (Frontend)

#### Backend Deployment on Render

1. **Create MongoDB Atlas Database:**
   - Go to MongoDB Atlas
   - Create a new cluster (free tier)
   - Click "Connect" → "Connect your application"
   - Copy the connection string (replace `<password>` with your password)
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern_investments?retryWrites=true&w=majority`

2. **Deploy Backend to Render:**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `thakurnischay/investment-dashboard-`
   - Configure:
     - **Name**: `investment-dashboard-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Root Directory**: Leave empty (or set to root)
   - Add Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your-super-secret-jwt-key-change-this
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://investment-dashboard-api.onrender.com`)

#### Frontend Deployment on Vercel

1. **Deploy Frontend to Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variable:
     ```
     VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Deploy"
   - Wait for deployment
   - Copy your frontend URL

2. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update the `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend service

#### Frontend Deployment on Netlify (Alternative)

1. **Deploy Frontend to Netlify:**
   - Go to https://netlify.com
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: `npm install && npm run build`
     - **Publish directory**: `frontend/dist`
   - Add Environment Variable:
     ```
     VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Deploy site"
   - Copy your frontend URL

### Option 2: Railway (Full Stack)

1. **Deploy Backend:**
   - Go to https://railway.app
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables:
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your-secret-key
     FRONTEND_URL=https://your-frontend-url.railway.app
     ```
   - Railway will auto-detect Node.js and deploy

2. **Deploy Frontend:**
   - In the same Railway project, click "New" → "GitHub Repo"
   - Select the same repository
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy

## Environment Variables Summary

### Backend (.env or Platform Settings)
```
NODE_ENV=production
PORT=10000 (or auto-assigned)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern_investments
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (Platform Settings)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## Post-Deployment Checklist

- [ ] Backend is accessible (test: `https://your-backend-url.com/`)
- [ ] Frontend is accessible
- [ ] Frontend can connect to backend (check browser console)
- [ ] MongoDB connection is working
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads data correctly

## Testing Your Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.com/
   # Should return: {"status":"OK","message":"MERN investment API running"}
   ```

2. **Test Frontend:**
   - Open your frontend URL
   - Try registering a new user (via API or frontend)
   - Try logging in
   - Check if dashboard loads

## Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Check your `MONGO_URI` format and ensure your IP is whitelisted in MongoDB Atlas
- **CORS Error**: Ensure `FRONTEND_URL` matches your frontend domain exactly
- **Port Issues**: Render uses port 10000, Railway auto-assigns

### Frontend Issues

- **API Connection Error**: Check `VITE_API_BASE_URL` is set correctly
- **Build Errors**: Ensure all dependencies are in `package.json`
- **404 on Routes**: Ensure redirect rules are configured (Vercel/Netlify handle this automatically)

## Custom Domain (Optional)

### Vercel
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

### Netlify
- Go to Site Settings → Domain Management
- Add custom domain
- Configure DNS

### Render
- Go to Service Settings → Custom Domain
- Add your domain
- Configure DNS

## Monitoring

- **Render**: Built-in logs and metrics
- **Vercel**: Analytics and logs in dashboard
- **Netlify**: Functions logs and analytics
- **Railway**: Built-in monitoring

## Cost

- **Render**: Free tier available (spins down after inactivity)
- **Vercel**: Free tier (generous limits)
- **Netlify**: Free tier (generous limits)
- **Railway**: $5/month after free trial
- **MongoDB Atlas**: Free tier (512MB storage)

## Support

For issues, check:
- Platform documentation
- GitHub Issues
- Stack Overflow
