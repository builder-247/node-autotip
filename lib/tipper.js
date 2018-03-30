const logger = require("./logger");
let tipQueue = [];
let session;
let bot;

function getCommand(tip) {
    if (tip.gamemode !== "all") {
        return `/tip ${tip.username} ${tip.gamemode}`
    } else {
        return "/tipall"
    }
}

function tip() {
    if (tipQueue.length > 0) {
        tipQueue.forEach((tip, i) => {
            setTimeout(() => {
                logger.info(getCommand(tip));
                bot.chat(getCommand(tip));
                tipQueue.shift();
            }, i * session.tipCycleRate * 1000);
        });
        return;
    }
}

function updateQueue(tips) {
    tipQueue = tips;
    tip();
}

function initTipper(_bot, autotipSession) {
    session = autotipSession;
    bot = _bot;
}

module.exports = {
    updateQueue,
    initTipper
};
