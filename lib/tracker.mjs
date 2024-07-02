/*
* Functions for tracking statistics
 */
import fs from 'fs';
import jsonfile from 'jsonfile';
import logger from './logger.mjs';

const trackerObj = {
  tips_sent: 0,
  tips_received: 0,
  exp: 0,
  karma: 0,
  coins: {},
};

function createDirIfNotExist(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(`${dirPath}/tips.json`)) {
    jsonfile.writeFileSync(`${dirPath}/tips.json`, trackerObj);
  }
}

function getStats(uuid, cb) {
  const path = `./stats/${uuid}/tips.json`;
  createDirIfNotExist(`./stats/${uuid}`);
  jsonfile.readFile(path, (err, obj) => {
    if (err) logger.error(err);
    cb(obj);
  });
}

function updateStats(obj, data, tip) {
  const stats = obj;
  const xpRegex = /\+([\d]*) Hypixel Experience/;
  const karmaRegex = /\+([\d]*) Karma/;
  const coinRegex = /\+([\d]*) ([\w\s]+) Coins/;
  if (tip.type === 'sent') {
    stats.tips_sent += Number(tip.amount);
  } else {
    stats.tips_received += Number(tip.amount);
  }
  data.forEach((entry) => {
    // eslint-disable-next-line
    switch (true) {
      case xpRegex.test(entry):
        stats.exp += Number(xpRegex.exec(entry)[1]);
        break;
      case karmaRegex.test(entry):
        stats.karma += Number(karmaRegex.exec(entry)[1]);
        break;
      case coinRegex.test(entry): {
        const [, coins, game] = coinRegex.exec(entry);
        stats.coins[game] = (typeof stats.coins[game] === 'number')
          ? stats.coins[game] + Number(coins)
          : Number(coins);
        break;
      }
    }
  });
  // logger.debug(JSON.stringify(stats));
  return stats;
}

export function tipIncrement(uuid, type, data) {
  getStats(uuid, (obj) => {
    const stats = updateStats(obj, data, type);
    jsonfile.writeFileSync(`./stats/${uuid}/tips.json`, stats);
  });
}

export function getTipCount(uuid, cb) {
  getStats(uuid, (stats) => {
    cb(stats.tips_sent);
  });
}

export function getLifetimeStats(uuid, cb) {
  getStats(uuid, (obj) => {
    const xp = obj.exp || 0;
    const karma = obj.karma || 0;
    let coins = 0;
    Object.keys(obj.coins || {}).forEach((game) => {
      coins += obj.coins[game];
    });
    return cb(`You've earned §3${xp} Exp§r, §6${coins} Coins§r and §d${karma} Karma§r using §bnode-autotip§r`);
  });
}
