/* eslint-disable max-len, class-methods-use-this */
const logger = require('./logger');
const tipper = require('./tipper');
const request = require('request');

class Session {
  constructor(obj) {
    this.json = obj;

    this.sessionKey = obj.sessionKey;
    this.keepAliveRate = obj.keepAliveRate;
    this.tipWaveRate = obj.tipWaveRate;
    this.tipCycleRate = obj.tipCycleRate;

    this.sendTipRequest();
    this.keepAlive = setInterval(() => this.sendKeepAlive(), this.keepAliveRate * 1000);
    this.tipWave = setInterval(() => this.sendTipRequest(), this.tipWaveRate * 1000);
  }

  sendKeepAlive() {
    const key = this.sessionKey;
    request(`https://api.autotip.pro/keepalive?key=${key}`, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(`Keeping alive session ${key}`);
      }
    });
  }

  sendTipRequest(games = []) {
    const key = this.sessionKey;
    request(`https://api.autotip.pro/tip?key=${key}`, (err, res, body) => {
      const JSONbody = JSON.parse(body);
      if (err) {
        logger.error(err);
      } else if (JSONbody.success) {
        const queue = (games.length > 0
          ? JSONbody.tips.filter(tip => games.includes(tip.gamemode))
          : JSONbody.tips);
        logger.info(`Need to tip ${JSON.stringify(queue)}`);
        tipper.updateQueue(queue);
      }
    });
  }

  logOut(cb) {
    request(`https://api.autotip.pro/logout?key=${this.sessionKey}`, (err, res, body) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(`Autotip logout: ${body}`);
      }
      cb();
    });
  }
}

module.exports = Session;
