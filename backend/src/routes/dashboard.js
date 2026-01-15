const express = require('express');
const { authMiddleware } = require('../utils/authMiddleware');
const { getUserDashboard } = require('../services/roiService');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await getUserDashboard(req.userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

