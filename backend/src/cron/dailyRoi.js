const cron = require('node-cron');
const { calculateDailyRoiForAll } = require('../services/roiService');

function scheduleDailyRoiJob() {
  // Runs every day at midnight server time
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily ROI cron job');
    try {
      await calculateDailyRoiForAll(new Date());
      console.log('Daily ROI cron job completed');
    } catch (err) {
      console.error('Error in daily ROI cron job', err);
    }
  });
}

module.exports = { scheduleDailyRoiJob };

