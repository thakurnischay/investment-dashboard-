require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const investmentRoutes = require('./src/routes/investments');
const dashboardRoutes = require('./src/routes/dashboard');
const referralRoutes = require('./src/routes/referrals');
const { scheduleDailyRoiJob } = require('./src/cron/dailyRoi');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'MERN investment API running' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_investments';

// Start server regardless of MongoDB connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Try to connect to MongoDB
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      scheduleDailyRoiJob();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      console.warn('Server is running but MongoDB is not connected. Some features may not work.');
    });
});

