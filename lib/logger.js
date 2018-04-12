const zlib = require("zlib");
const fs = require("fs");
const writer = require("./writer");
const util = require("../util/Utility");

const white = "\u001b[97m";
const green = "\u001b[92m";
const red = "\u001b[91m";
const purple = "\u001b[95m";
const gray = "\u001b[37m";
let date = new Date(Date.now());

// YYYY-MM-DD-hh-mm
const logName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

function getTimeStamp() {
    date = new Date(Date.now());
    return date.toLocaleTimeString()
}

function compressLogs(cb) {
    function compressFile(filename, callback) {
        info(`Compressing ${filename}`);
        const path = `./logs/${filename}`;
        const compress = zlib.createGzip(),
            input = fs.createReadStream(path),
            output = fs.createWriteStream(`${path}.gz`);
        input.pipe(compress).pipe(output);
        function deleteFile() {
            fs.unlink(path,(err) => {
                if (err) throw err;
                callback()
            })
        }
        if (callback) {
            output.on('end', deleteFile)
        }
    }
    let logFiles = [];
    function getLogFiles(cb) {
        fs.readdir("./logs/", (err, files) => {
            files.forEach(file => {
                if (file.endsWith(".log")) {
                    info(`Found a log file to compress: ${file}`);
                    logFiles.push(file)
                }
            });
            cb()
        });
    }
    getLogFiles(() => {
        logFiles.forEach(file => {
            function getNext(callback) {
                if (logFiles.length) {
                    compressFile(logFiles.shift(), function () {
                        getNext(callback);
                    });
                } else if (callback) {
                    callback();
                }
            }
            getNext(function () {
                console.log('File compression ended');
            });
        })
    })
}

function initLog() {
    writer.checkDirectory("./logs", () => {
    });
    compressLogs(() => {});
    writer.writeToFile(logPath, "Initializing node-autotip...", () => {
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