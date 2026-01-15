const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true }, // e.g. "PLAN_A"
    dailyRoiPercent: { type: Number, required: true }, // e.g. 1.5 means 1.5% per day
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    lastRoiDate: { type: Date }, // last date ROI was applied, used for idempotency
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);

