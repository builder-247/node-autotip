const white = "\u001b[97m";
const green = "\u001b[92m";
const red = "\u001b[91m";
const purple = "\u001b[95m";
const gray = "\u001b[37m";

function getTimeStamp() {
    return new Date(Date.now()).toLocaleTimeString()
}

function game(msg) {
    console.log(`${gray}[${getTimeStamp()}] ${green}[GAME]${white} ${msg}`)
}

function info(msg) {
    console.log(`${gray}[${getTimeStamp()}] [INFO] ${msg}`)
}

function error(msg) {
    console.log(`${gray}[${getTimeStamp()}] ${red}[ERROR]${white} ${msg}`)
}

function dev(msg) {
    if (true/*process.argv[3] === "dev"*/) {
        console.log(`${gray}[${getTimeStamp()}] ${purple}[DEV]${white}  ${msg}`)
    }
}

module.exports = {
    game,
    info,
    error,
    dev
};