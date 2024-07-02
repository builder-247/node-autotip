/* eslint comma-dangle: ["error", {"functions": "never"}] */
import axios from 'axios';
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

async function joinServer(params) {
  const options = {
    url: 'https://sessionserver.mojang.com/session/minecraft/join',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params,
  };
  const res = await axios(options);
  if (![200, 204].includes(res.status)) {
    logger.error(`Error ${res.status} during authentication: Session servers down?`);
    throw new Error(res.data);
  }
}

async function autotipLogin(uuid, session, hash) {
  const tipCount = await getTipCount(uuid);
  return axios({
    url: 'https://api.autotip.pro/login',
    method: 'GET',
    params: {
      username: session.selectedProfile.name,
      uuid: removeDashes(uuid),
      tips: tipCount + 1,
      v: '3.0.1',
      mc: '1.8.9',
      os: os.type(),
      hash
    },
    headers
  });
}

async function login(uuid, session) {
  const { accessToken } = session;
  logger.debug(`Trying to log in as ${removeDashes(uuid)}`);

  const hash = getServerHash(removeDashes(uuid));
  logger.debug(`Server hash is: ${hash}`);

  await joinServer({
    accessToken,
    selectedProfile: removeDashes(uuid),
    serverId: hash
  });

  logger.debug('Successfully created Mojang session!');
  const { data } = await autotipLogin(uuid, session, hash);

  if (!data.success) {
    logger.error(`Autotip login failed! ${data}`);
    throw data;
  }
  logger.debug(`Autotip session: ${data}`);
  return new Session(data);

}

export default login;
