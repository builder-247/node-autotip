const mineflayer = require("mineflayer");
const utility = require("./util/Utility");
const login = require("./lib/login");
const logger = require("./lib/logger");
const tracker = require("./lib/tracker");
const credentials = require("./credentials.json");
const options = {
    host: "mc.hypixel.net",
    port: 25565,
    version: "1.8.9",
    username: credentials.username,
    password: credentials.password
};
init();
function init() {
    bot = mineflayer.createBot(options);
    bot._client.once('session', session => options.session = session);
    bot.once('end', () => {
        setTimeout(function () {
            logger.info("Reconnecting...");
            init();
        }, 30000);
    });
}

function getUUID(bot) {
    return bot.players[bot.username].uuid
}

function tipAll() {
    logger.info("Running /tipall...");
    bot.chat(`/tipall`);
}

let uuid;
let autotipSession;

bot.on(`login`, () => {
    logger.info(`Logged on ${options.host}:${options.port}`);
    setTimeout(() => {
        const session = bot._client.session;
        uuid = getUUID(bot);
        login.login(uuid, session, (aSession) => {
            autotipSession = aSession;
        });
        tipAll();
    }, 1000);
    setInterval(function () {
        tipAll()
    }, 15000 * 60)
});

bot.on('message', (message) => {
    tracker(message, uuid);
    logger.game(message.toAnsi())
});

bot.on('kicked', (reason) => {
    logger.info(`Kicked for ${reason}`)
});