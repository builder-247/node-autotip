const logger = require("./logger");
const tipper = require("./tipper");
const request = require("request");

class Session {
    constructor(obj) {
        logger.info(JSON.stringify(obj));
        logger.info(obj.sessionKey);

        this.json = obj;

        this.sessionKey = obj.sessionKey;
        logger.info("key: " + this.sessionKey);
        this.keepAliveRate = obj.keepAliveRate;
        this.tipWaveRate = obj.tipWaveRate;
        this.tipCycleRate = obj.tipCycleRate;

        this.sendTipRequest(this.sessionKey);
        this.keepAlive = setInterval(() => this.sendKeepAlive(this.sessionKey), this.keepAliveRate * 1000);
        this.tipWave = setInterval(() => this.sendTipRequest(this.sessionKey), this.tipWaveRate * 1000);
    }

    sendKeepAlive(key) {
        request(`https://api.autotip.pro/keepalive?key=${key}`, (err) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Keeping alive session ${key}`);
            }
        });
    }

    sendTipRequest(key) {
        request(`https://api.autotip.pro/tip?key=${key}`, (err, res, body) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Need to tip ${body}`);
                tipper.updateQueue(JSON.parse(body).tips);
            }
        });
    }

    logOut(cb) {
        request(`https://api.autotip.pro/logout?key=${this.sessionKey}`, (err, res, body) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Logged out ${body}`);
            }
            cb()
        });
    }
}

module.exports = Session;