/* eslint comma-dangle: ["error", {"functions": "never"}] */
import axios from 'axios';
import request from 'request';
import crypto from 'crypto';
import os from 'os';
import packageJson from '../package.json' assert { type: "json" };
import { removeDashes } from '../util/utility.mjs';
import logger from './logger.mjs';
import createHash from '../util/createHash.mjs';
import Session from './session.mjs';
import { getTipCount } from './tracker.mjs';

const headers = {
  'User-Agent': `node-autotip@${packageJson.version}`
};

function getServerHash(uuid) {
  const salt = BigInt('0x' + crypto.randomBytes(130).toString('hex')).toString(32);
  return createHash(uuid + salt);
}

async function joinServer(params, cb) {
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

async function autotipLogin(uuid, session, hash, cb) {
  getTipCount(uuid, (tipCount) => {
    request(
      {
        url: 'https://api.autotip.pro/login',
        params: {
          username: session.selectedProfile.name,
          uuid: removeDashes(uuid),
          tips: tipCount + 1,
          v: '2.1.0.6',
          mc: '1.8.9',
          os: os.type(),
          hash
        },
        headers
      },
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
  logger.debug(`Trying to log in as ${removeDashes(uuid)}`);

  const hash = getServerHash(removeDashes(uuid));
  logger.debug(`Server hash is: ${hash}`);

  joinServer({
    accessToken,
    selectedProfile: removeDashes(uuid),
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
            throw body;
          }
          logger.debug(`Autotip session: ${body}`);
          cb(new Session(json));
        }
      });
    }
  });
}

export default login;
