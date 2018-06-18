const logger = require('./logger');

let tipQueue = [];
let session;
let bot;

function getCommand(newTip) {
  if (newTip.gamemode !== 'all') {
    return `/tip ${newTip.username} ${newTip.gamemode}`;
  }
  return '/tipall';
}

function tip() {
  if (tipQueue.length > 0) {
    tipQueue.forEach((newTip, i) => {
      setTimeout(() => {
        logger.info(getCommand(newTip));
        bot.chat(getCommand(newTip));
        tipQueue.shift();
      }, i * session.tipCycleRate * 1000);
    });
  }
}

function updateQueue(tips) {
  tipQueue = tips;
  tip();
}

function initTipper(_bot, autotipSession) {
  session = autotipSession;
  bot = _bot;
}

module.exports = {
  updateQueue,
  initTipper,
};
