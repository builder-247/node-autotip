const logger = require("./logger");
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

        this.keepAlive = setInterval(() => this.sendKeepAlive(this.sessionKey), this.keepAliveRate * 10);
        this.tipWave = setInterval(() => this.sendTipRequest(this.sessionKey), this.tipWaveRate * 10)
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
                //TODO: QUEUE UP ALL SPECIFIC TIPS AT THE SPECIFIED RATE (CYCLE)
            }
        });
    }

    logout()
}

module.exports = Session;