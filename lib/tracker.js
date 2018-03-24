const logger = require("./logger");
const writer = require("./writer");

// Return current date in the following format: DD-MM-YYYY
function getDate() {
    const date = new Date(Date.now());
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

function initTracker(uuid) {
    writer.checkDirectory(`./stats/${uuid}/`, (err) => {
        if (err) {
            logger.error(err)
        }
    })
}

function parse(regex, message) {
    const x = message.match(regex);
    if (!x) {
        return 0;
    }
    logger.dev(parseInt(x[0], 10));
    return parseInt(x[0], 10)
}

/*
function updateStats(stats) {
    fs.appendFile(`/stats/uuid/${getDate()}.at`, stats, function (err) {
        if (err) throw err;
    });

    function createFile() {

    }
}
let playersTipped = 0;
let xp = 0;
module.exports = function track(input, uuid) {

    const message = input.toString();
    //console.log(`Tracker: ${message}`);
    let old = playersTipped;
    playersTipped += parse(/You tipped .* players! You got the following rewards:/g, message);
    xp += parse(/\+.* Hypixel Experience/g, message);
    if (playersTipped > old) {
        logger.dev(`Players tipped: ${playersTipped}`)
    }

};*/
module.exports = {
    initTracker
};