const logger = require("./logger");
let tipQueue = [];

function getCommand(tip) {
    if (tip.gamemode !== "all") {
        return `/tip ${tip.username} ${tip.gamemode}`
    } else {
        return "/tipall"
    }
}

function updateQueue(tips) {
    tipQueue = tips;
}

function tipPlayers(session) {
    if (tipQueue.length > 0) {
        tipQueue.forEach((tip, i) => {
            setTimeout(() => {
                logger.info(getCommand(tip));
                bot.chat(getCommand(tip));
                tipQueue.shift();
            }, i * session.tipCycleRate * 1000);
        })
    }
}

function initTipper(bot, session) {
    setInterval(() => {
        tipPlayers(session);
    }, 30 * 1000);
}

module.exports = {
    updateQueue,
    initTipper
};
