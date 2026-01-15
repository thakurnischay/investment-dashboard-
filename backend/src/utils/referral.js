const User = require('../models/User');

async function generateReferralCode() {
  let code;
  let exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    // eslint-disable-next-line no-await-in-loop
    exists = await User.exists({ referralCode: code });
  }
  return code;
}

/**
 * Get referral hierarchy for a user (direct and indirect).
 * Simple breadth-first traversal up to a fixed depth, e.g. 3 levels.
 */
async function getReferralTree(userId, maxDepth = 3) {
  const buildLevel = async (parentIds, level, acc) => {
    if (level > maxDepth || parentIds.length === 0) return;
    const children = await User.find({ referredBy: { $in: parentIds } }).select(
      '_id name email referralCode referredBy'
    );
    const childIds = children.map((c) => c._id);
    acc.push({
      level,
      users: children,
    });
    await buildLevel(childIds, level + 1, acc);
  };

  const levels = [];
  await buildLevel([userId], 1, levels);
  return levels;
}

module.exports = { generateReferralCode, getReferralTree };

