/* eslint-disable no-underscore-dangle, no-return-assign */
const mineflayer = require('mineflayer');
const login = require('./lib/login');
const logger = require('./lib/logger');
const tracker = require('./lib/tracker');
const tipper = require('./lib/tipper');
const credentials = require('./credentials.json');

const options = {
  host: 'mc.hypixel.net',
  port: 25565,
  version: '1.8.9',
  username: credentials.username,
  password: credentials.password,
};
let bot;
(function init() {
  bot = mineflayer.createBot(options);
  bot._client.once('session', session => options.session = session);
  bot.once('end', () => {
    setTimeout(() => {
      logger.info('Reconnecting...');
      init();
    }, 60000);
  });
}());

function getUUID() {
  return bot._client.session.selectedProfile.id;
}

function sendToLimbo() {
  logger.info('Sending player to limbo...');
  bot.chat('/achat §c');
}

let uuid;
let autotipSession;

bot.on('login', () => {
  uuid = getUUID(bot);
  logger.initLog();
  tracker.initTracker(uuid);
  logger.info(`Logged on ${options.host}:${options.port}`);
  setTimeout(() => {
    const { session } = bot._client;
    sendToLimbo();
    login(uuid, session, (aSession) => {
      autotipSession = aSession;
      tipper.initTipper(bot, autotipSession);
    });
  }, 1000);
});

bot.on('message', (message) => {
  const msg = message.toString();
  logger.game(message.toAnsi());
  if (msg.startsWith('You tipped')) {
    tracker.tipIncrement();
  }
  if (msg.startsWith('That player is not online, try another user!')) {
    tipper.tipFailed();
  }
});

bot.on('kicked', (reason) => {
  logger.info(`Kicked for ${reason}`);
});

function gracefulShutdown() {
  logger.info('Received kill signal, shutting down gracefully.');
  autotipSession.logOut(() => {
    logger.info('Closed out remaining connections.');
    process.exit();
  });
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
