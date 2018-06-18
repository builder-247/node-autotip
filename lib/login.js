/* eslint comma-dangle: ["error", {"functions": "never"}] */
const request = require('request');
const util = require('../util/Utility');
const logger = require('./logger');
const bigInt = require('big-integer');
const createHash = require('../util/createHash');
const Session = require('./session');

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
    if (res.statusCode !== 204) {
      logger.error(`Error ${res.statusCode} during authentication: Session servers down?`);
      return cb(res.statusCode, null);
    }
    return cb(null, true);
  });
}

function autotipLogin(uuid, session, hash, cb) {
  request(
    `https://api.autotip.pro/login?username=${session.selectedProfile.name}&uuid=${util.removeDashes(uuid)}&tips=1338&v=2.1.0.6&mc=1.8.9&os=Windows&hash=${hash}`,
    (err, res, body) => {
      if (err) {
        cb(err, null);
      }
      cb(null, body);
    }
  );
}

function login(uuid, session, cb) {
  const { accessToken } = session;
  logger.info(`Trying to log in as ${util.removeDashes(uuid)}`);

  const hash = getServerHash(util.removeDashes(uuid));
  logger.info(`Server hash is: ${hash}`);

  joinServer({
    accessToken,
    selectedProfile: util.removeDashes(uuid),
    serverId: hash
  }, (err, success) => {
    if (success) {
      logger.info('Successfully created Mojang session!');

      autotipLogin(uuid, session, hash, (loginErr, body) => {
        if (loginErr) {
          logger.error(loginErr);
        } else {
          if (!JSON.parse(body).success) {
            logger.error(body);
          }
          logger.info(`Autotip session: ${body}`);
          cb(new Session(JSON.parse(body)));
        }
      });
    }
  });
}

module.exports = {
  login
};
