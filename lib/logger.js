const writer = require("./writer");
const util = require("../util/Utility");

const white = "\u001b[97m";
const green = "\u001b[92m";
const red = "\u001b[91m";
const purple = "\u001b[95m";
const gray = "\u001b[37m";
const date = new Date(Date.now());

// YYYY-MM-DD-hh-mm
const logName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

function getTimeStamp() {
    return date.toLocaleTimeString()
}

function initLog() {
    writer.checkDirectory("./logs", () => {
    });
    writer.writeToFile(`./logs/${logName}.log`, "Initializing node-autotip...", () => {
    });
}

function writeToLogFile(string) {
    writer.appendToFile(`./logs/${logName}.log`, "\n" + string, () => {

        }
    )
}

function log(msg) {
    const message = `${gray}[${getTimeStamp()}] ${msg}`;
    writeToLogFile(util.removeANSIFormatting(message));
    console.log(message);
}

function game(msg) {
    log(`${green}[GAME]${white} ${msg}`)
}

function info(msg) {
    log(`[INFO] ${msg}`)
}

function error(msg) {
    log(`${red}[ERROR]${white} ${msg}`)
}

function dev(msg) {
    if (true/*process.argv[3] === "dev"*/) {
        log(`${purple}[DEV]${white}  ${msg}`)
    }
}

module.exports = {
    initLog,
    game,
    info,
    error,
    dev
};