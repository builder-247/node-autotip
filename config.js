const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  dotenv.config();
}

const defaults = {
  NODE_ENV: 'production',
  TIP_KARMA: 500, // Amount of karma gained for tipping a player, depends on player rank
  PRINT_REWARDS: true, // Whether tip rewards like coins and xp should be logged
  HIDE_TIP_MESSAGES: true, // Hide chat spam from tipping
  HIDE_JOIN_MESSAGES: true, // Hide player join messages
  HIDE_WATCHDOG_MESSAGES: true, // Hide [WATCHDOG CHEAT DETECTION] messages
  CHANGE_LANGUAGE: 'english', // Changes the Language to your preferred language
};

// ensure that process.env has all values in defaults, but prefer the process.env value
Object.keys(defaults).forEach((key) => {
  process.env[key] = (key in process.env) ? process.env[key] : defaults[key];
});
// now processes can use either process.env or config
module.exports = process.env;
