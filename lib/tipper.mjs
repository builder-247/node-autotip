import logger from './logger.mjs';

let tipQueue = [];
let failQueue = [];
let lastGame;
let session;
let bot;

function getCommand(newTip) {
  if (newTip.gamemode !== 'all') {
    return `/tip ${newTip.username} ${newTip.gamemode}`;
  }
  return '/tipall';
}

function checkFailedTips() {
  setTimeout(() => {
    if (tipQueue.length === 0 && failQueue.length > 0) {
      logger.debug(`Found failed tips in ${failQueue}, requesting new players...`);
      session.sendTipRequest(failQueue);
      failQueue = [];
    }
  }, 2 * 1000);
}

function tip() {
  if (tipQueue.length > 0) {
    tipQueue.forEach((newTip, i) => {
      setTimeout(() => {
        lastGame = newTip.gamemode;
        const command = getCommand(newTip);
        logger.debug(command);
        bot.chat(command);
        tipQueue.shift();
        checkFailedTips();
      }, (i + 1) * session.tipCycleRate * 1000);
    });
  }
}

export function updateQueue(tips) {
  tipQueue = tips;
  tip();
}

export function tipFailed() {
  failQueue.push(lastGame);
}

export function initTipper(_bot, autotipSession) {
  session = autotipSession;
  bot = _bot;
}
