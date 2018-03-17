const logger = require("./logger");
let tipQueue = [
    "all"
];

function getCommand(tip) {
    if (typeof tip === "object") {
        for (let key in tip) {
            return `/tip ${tip[key]} ${key}`
        }
    } else {
        return "/tipall"
    }
}

function tipCommand(command) {
    setTimeout(() => {
        logger.info(command);
        bot.chat(command);
    }, 3000)
}

module.exports = (bot) => {
    setInterval(() => {
        if (tipQueue.length > 0) {
            tipQueue.forEach((tip, i) => {
                setTimeout(() => {
                    tipCommand(getCommand(tip));
                    tipQueue.shift();
                }, i * 4000);
            })
        }
    }, 1000 * 10);
};
