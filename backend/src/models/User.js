const mongoose = require('mongoose');

const levelIncomeSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    level: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const roiBalanceSchema = new mongoose.Schema(
  {
    totalRoi: { type: Number, default: 0 }, // accumulated ROI
    lastCalculatedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    walletBalance: { type: Number, default: 0 }, // total withdrawable balance
    roiBalance: { type: roiBalanceSchema, default: () => ({}) },
    levelIncome: { type: [levelIncomeSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

