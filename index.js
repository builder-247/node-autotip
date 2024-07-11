/* eslint-disable no-underscore-dangle, no-return-assign */
const mineflayer = require('mineflayer');
const wait = require('util').promisify(setTimeout);
const config = require('./config');
const login = require('./lib/login');
const logger = require('./lib/logger');
const { tipIncrement, getLifetimeStats } = require('./lib/tracker');
const tipper = require('./lib/tipper');
const util = require('./util/utility');
const credentials = require('./credentials.json');

let bot;
let uuid;
let autotipSession;

const options = {
  host: 'mc.hypixel.net',
  port: 25565,
  version: '1.8.9',
  auth: credentials.legacy ? 'mojang' : 'microsoft',
  username: credentials.username,
  password: credentials.password,
};

function getUUID() {
  return bot._client.session.selectedProfile.id;
}

function setLang(language = 'english') {
  logger.info(`Changing language to ${language}`);
  bot.chat(`/lang ${language}`);
}

function sendToLimbo() {
  logger.info('Sending player to limbo...');
  bot._client.write('chat', { message: '§' });
}

function getHoverData(message) {
  const arr = message.hoverEvent.value.text.split('\n');
  arr.shift();
  return arr;
}

function logRewards(arr = []) {
  if (config.PRINT_REWARDS) {
    arr.forEach((line) => {
      logger.game(util.toANSI(`${line}§r`));
    });
  }
}

function chatLogger(message) {
  const str = message.toString();
  const ansi = message.toAnsi();
  const regex = /You've already tipped someone in the past hour in [\w\s]*! Wait a bit and try again!/;
  const blacklist = [
    'A kick occurred in your connection, so you have been routed to limbo!',
    'Illegal characters in chat',
    'That player is not online, try another user!',
    'No one has a network booster active right now! Try again later.',
    'You already tipped everyone that has boosters active, so there isn\'t anybody to be tipped right now!',
    'You\'ve already tipped someone in the past hour in',
  ];
  if (config.HIDE_TIP_MESSAGES) {
    if (blacklist.includes(str) || regex.test(str)) {
      logger.debug(ansi);
      return;
    }
  }
  if (config.HIDE_JOIN_MESSAGES) {
    if (/(^Friend|Guild) > [\w]+ (left|joined)\.$/.test(str)) {
      logger.debug(ansi);
      return;
    }
  }
  if (config.HIDE_WATCHDOG_MESSAGES) {
    if (/^\[WATCHDOG ANNOUNCEMENT]$/.test(str) ||
      /^Watchdog has banned [0-9,]+ players in the last 7 days\.$/.test(str) ||
      /^Staff have banned an additional [0-9,]+ in the last 7 days\.$/.test(str) ||
      /^Blacklisted modifications are a bannable offense!$/.test(str) || str === '') {
      logger.debug(ansi);
      return;
    }
  }
  logger.game(ansi);
}

function onLogin() {
  uuid = getUUID(bot);
  setLang();
  logger.debug(`Logged on ${options.host}:${options.port}`);
  getLifetimeStats(uuid, (stats) => {
    logger.info(util.toANSI(stats));
  });
  setTimeout(() => {
    const { session } = bot._client;
    sendToLimbo();
    if (autotipSession === undefined) {
      login(uuid, session, (aSession) => {
        autotipSession = aSession;
        return tipper.initTipper(bot, autotipSession);
      });
    }
    tipper.initTipper(bot, autotipSession);
  }, 1000);
}

function onMessage(message, position) {
  if (position !== 'chat') return;
  const msg = message.toString();
  chatLogger(message);
  if (msg.startsWith('You tipped')) {
    const arr = getHoverData(message);
    const tips = (/tipped \w* players in (\d*)/.exec(msg) !== null)
      ? /tipped \w* players in (\d*)/.exec(msg)[1]
      : 1;
    const karma = (tips > 1 && arr.some(line => line.includes('Quakecraft')))
      ? (tips - 5) * config.TIP_KARMA
      : tips * config.TIP_KARMA;
    arr.push(`§d+${karma} Karma`);
    tipIncrement(uuid, { type: 'sent', amount: tips }, arr);
    logRewards(arr);
  }
  if (msg.startsWith('You were tipped')) {
    const arr = getHoverData(message);
    try {
      const tips = /by (\d*) players?/.exec(msg)[1];
      tipIncrement(uuid, { type: 'received', amount: tips }, arr);
    } catch (e) {
      //
    }
    logRewards(arr);
  }
  if (msg.startsWith('That player is not online, try another user!')
    || msg.startsWith('You\'ve already tipped that person today')
    || msg.startsWith('Can\'t find a player by the name of')) {
    tipper.tipFailed();
  }
}

(function init() {
  bot = mineflayer.createBot(options);
  bot._client.once('session', session => options.session = session);
  bot.once('login', onLogin);
  bot.on('message', onMessage);
  bot.on('kicked', (reason) => {
    logger.info(`Kicked for ${reason}`);
  });
  bot.once('end', () => setTimeout(init, 10000));
}());

async function gracefulShutdown() {
  logger.info('Received kill signal, shutting down gracefully.');
  // Change language to a preferred one. Need to leave limbo first to run the command.
  bot.chat('/hub');
  await wait(1000);
  setLang(config.CHANGE_LANGUAGE);
  await wait(1000);

  try {
    autotipSession.logOut(() => {
      logger.info('Closed out remaining connections.');
      process.exit();
    });
  } catch (e) {
    logger.warn('Closing without establishing autotip session.');
    process.exit();
  }

  // if after
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 10 * 1000);
}
// listen for TERM signal .e.g. kill
process.once('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.once('SIGINT', gracefulShutdown);
