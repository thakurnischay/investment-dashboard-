const express = require('express');
const Investment = require('../models/Investment');
const { authMiddleware } = require('../utils/authMiddleware');

const router = express.Router();

// Create investment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, plan, dailyRoiPercent, startDate, endDate } = req.body;
    if (!amount || !plan || !dailyRoiPercent || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const investment = await Investment.create({
      user: req.userId,
      amount,
      plan,
      dailyRoiPercent,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'ACTIVE',
    });

    res.status(201).json(investment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's investments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

