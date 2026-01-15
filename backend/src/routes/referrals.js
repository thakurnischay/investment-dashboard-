const express = require('express');
const { authMiddleware } = require('../utils/authMiddleware');
const { getReferralTree } = require('../utils/referral');

const router = express.Router();

// Nested referral tree for current user
router.get('/tree', authMiddleware, async (req, res) => {
  try {
    const tree = await getReferralTree(req.userId, 3);
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

