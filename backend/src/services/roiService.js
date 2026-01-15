const dayjs = require('dayjs');
const Investment = require('../models/Investment');
const User = require('../models/User');
const RoiHistory = require('../models/RoiHistory');
const { getReferralTree } = require('../utils/referral');

// Simple referral percentage by level (can be adapted)
const LEVEL_PERCENT = {
  1: 5, // 5% of daily ROI from direct referrals
  2: 3,
  3: 2,
};

/**
 * Calculate and persist daily ROI for all active investments.
 * Idempotent per day using investment.lastRoiDate and roiHistory duplicates check.
 */
async function calculateDailyRoiForAll(date = new Date()) {
  const targetDate = dayjs(date).startOf('day').toDate();

  const activeInvestments = await Investment.find({
    status: 'ACTIVE',
    startDate: { $lte: targetDate },
    endDate: { $gte: targetDate },
  });

  for (const inv of activeInvestments) {
    // skip if ROI already applied for this date
    if (inv.lastRoiDate && dayjs(inv.lastRoiDate).isSame(targetDate, 'day')) {
      // already processed today
      // eslint-disable-next-line no-continue
      continue;
    }

    const user = await User.findById(inv.user); // eslint-disable-line no-await-in-loop
    if (!user) continue; // eslint-disable-line no-continue

    const roiAmount = (inv.amount * inv.dailyRoiPercent) / 100;

    // create ROI history (idempotent guard)
    const existingHistory = await RoiHistory.findOne({ // eslint-disable-line no-await-in-loop
      user: user._id,
      investment: inv._id,
      date: targetDate,
    });
    if (existingHistory) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // update user ROI balance and wallet
    user.roiBalance.totalRoi += roiAmount;
    user.roiBalance.lastCalculatedAt = targetDate;
    user.walletBalance += roiAmount;
    // eslint-disable-next-line no-await-in-loop
    await user.save();

    // eslint-disable-next-line no-await-in-loop
    await RoiHistory.create({
      user: user._id,
      investment: inv._id,
      date: targetDate,
      amount: roiAmount,
    });

    inv.lastRoiDate = targetDate;
    // eslint-disable-next-line no-await-in-loop
    await inv.save();

    // also distribute level income up the referral tree
    // eslint-disable-next-line no-await-in-loop
    await distributeLevelIncome(user._id, roiAmount, targetDate);
  }
}

/**
 * Walk up referral chain and add level income entries + wallet credit.
 */
async function distributeLevelIncome(userId, roiAmount, date) {
  let currentUser = await User.findById(userId).select('referredBy'); // eslint-disable-line no-await-in-loop
  let level = 1;

  while (currentUser && currentUser.referredBy && level <= 3) {
    // eslint-disable-next-line no-await-in-loop
    const parent = await User.findById(currentUser.referredBy);
    if (!parent) break;

    const percent = LEVEL_PERCENT[level] || 0;
    if (percent > 0) {
      const income = (roiAmount * percent) / 100;
      parent.levelIncome.push({
        fromUser: userId,
        level,
        amount: income,
        date,
      });
      parent.walletBalance += income;
      // eslint-disable-next-line no-await-in-loop
      await parent.save();
    }

    currentUser = parent;
    level += 1;
  }
}

/**
 * Helper to compute dashboard aggregates for a user.
 */
async function getUserDashboard(userId) {
  const [user, investments, roiHistory] = await Promise.all([
    User.findById(userId),
    Investment.find({ user: userId }),
    RoiHistory.find({ user: userId }),
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalRoi = user.roiBalance.totalRoi || 0;
  const totalLevelIncome = user.levelIncome.reduce((sum, li) => sum + li.amount, 0);

  // derive today's ROI
  const today = dayjs().startOf('day');
  const todayRoi = roiHistory
    .filter((r) => dayjs(r.date).isSame(today, 'day'))
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      walletBalance: user.walletBalance,
    },
    totals: {
      totalInvestments,
      totalRoi,
      totalLevelIncome,
      todayRoi,
    },
    investments,
    levelIncome: user.levelIncome,
  };
}

module.exports = {
  calculateDailyRoiForAll,
  distributeLevelIncome,
  getUserDashboard,
};

