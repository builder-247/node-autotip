const white = "\u001b[97m";
const green = "\u001b[92m";
const red = "\u001b[91m";
const purple = "\u001b[95m";
const gray = "\u001b[37m";

function getTimeStamp() {
    return new Date(Date.now()).toLocaleTimeString()
}

function log(msg) {
    const message = `${gray}[${getTimeStamp()}] ${msg}`;
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
    game,
    info,
    error,
    dev
};