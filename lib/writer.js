const fs = require("fs");
const logger = require("./logger");

function checkDirectory(directory, cb) {
    fs.stat(directory, function(err, stats) {
        if (err && err.errno === -4058) {
            fs.mkdir(directory, cb);
        } else {
            cb(err)
        }
    });
}

function appendToFile(path, input, cb) {
    fs.appendFile(path, input, (err) => {

    })
}

function writeToFile(path, input, cb) {
    fs.writeFile(path, input, (err, data) => {
        if (err) {
            logger.error(err)
        }
    })
}

module.exports = {
    checkDirectory,
    appendToFile,
    writeToFile
};