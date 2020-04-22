/* eslint comma-dangle: ["error", {"functions": "never"}] */
const request = require('request');
const os = require('os');
const util = require('../util/utility');
const logger = require('./logger');
const bigInt = require('big-integer');
const createHash = require('../util/createHash');
const Session = require('./session');
const { getTipCount } = require('./tracker');

function getServerHash(uuid) {
  const salt = bigInt.randBetween('0', '1.3611295e39').toString(32);
  return createHash(uuid + salt);
}

function joinServer(params, cb) {
  const options = {
    url: 'https://sessionserver.mojang.com/session/minecraft/join',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  };
  request(options, (err, res) => {
    if (err) {
      return cb(err, null);
    }
    if (![200, 204].includes(res.statusCode)) {
      logger.error(`Error ${res.statusCode} during authentication: Session servers down?`);
      return cb(res.statusCode, null);
    }
    return cb(null, true);
  });
}

function autotipLogin(uuid, session, hash, cb) {
  getTipCount(uuid, (tipCount) => {
    request(
      `https://api.autotip.pro/login?username=${session.selectedProfile.name}&uuid=${util.removeDashes(uuid)}&tips=${tipCount + 1}&v=2.1.0.6&mc=1.8.9&os=${os.type()}&hash=${hash}`,
      (err, res, body) => {
        if (err) {
          cb(err, null);
        }
        cb(null, body);
      }
    );
  });
}

function login(uuid, session, cb) {
  const { accessToken } = session;
  logger.debug(`Trying to log in as ${util.removeDashes(uuid)}`);

  const hash = getServerHash(util.removeDashes(uuid));
  logger.debug(`Server hash is: ${hash}`);

  joinServer({
    accessToken,
    selectedProfile: util.removeDashes(uuid),
    serverId: hash
  }, (err, success) => {
    if (success) {
      logger.debug('Successfully created Mojang session!');

      autotipLogin(uuid, session, hash, (loginErr, body) => {
        let json = {};
        if (loginErr) {
          logger.error(`Unable to login to autotip: ${loginErr}`);
        } else {
          try {
            json = JSON.parse(body);
          } catch (e) {
            logger.warn(`Invalid json response from autotip login server! ${e}`);
          }
          if (!json.success) {
            logger.error(`Autotip login failed! ${body}`);
          }
          logger.debug(`Autotip session: ${body}`);
          cb(new Session(json));
        }
      });
    }
  });
}

module.exports = login;
