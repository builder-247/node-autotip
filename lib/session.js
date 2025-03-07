/* eslint-disable max-len, class-methods-use-this */
const packageJson = require('../package.json');
const logger = require('./logger');
const tipper = require('./tipper');
const request = require('request');

const headers = {
  'User-Agent': `node-autotip@${packageJson.version}`,
};

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
    request({
      url: `https://autotip.sk1er.club/keepalive?key=${key}`,
      headers,
    }, (err) => {
      if (err) {
        logger.error(`Failed sending keepalive request! ${err}`);
      } else {
        logger.debug(`Keeping alive session ${key}`);
      }
    });
  }

  sendTipRequest(games = []) {
    const key = this.sessionKey;
    request({
      url: `https://autotip.sk1er.club/tip?key=${key}`,
      headers,
    }, (err, res, body) => {
      let JSONbody = {};
      try {
        JSONbody = JSON.parse(body);
      } catch (e) {
        logger.warn(`Tipper sent invalid json body! ${e}`);
      }
      if (err) {
        logger.error(`${err}`);
      } else if (JSONbody.success) {
        const queue = (games.length > 0
          ? JSONbody.tips.filter(tip => games.includes(tip.gamemode))
          : JSONbody.tips);
        logger.debug(`Need to tip ${JSON.stringify(queue)}`);
        tipper.updateQueue(queue);
      }
    });
  }

  logOut(cb) {
    request({
      url: `https://autotip.sk1er.club/logout?key=${this.sessionKey}`,
      headers,
    }, (err, res, body) => {
      if (err) {
        logger.error(`Failed sending logout request! ${err}`);
      } else {
        logger.debug(`Autotip logout: ${body}`);
      }
      cb();
    });
  }
}

module.exports = Session;
