const fs = require('fs');
const logger = require('./logger');

function checkDirectory(directory, cb) {
  fs.stat(directory, (err) => {
    if (err && err.errno === -4058) {
      fs.mkdir(directory, cb);
    } else {
      cb(err);
    }
  });
}

function readFile(path, cb) {
  fs.readFile(path, (err, data) => {
    if (err) {
      // logger.error(err);
    }
    return cb(data);
  });
}

function appendToFile(path, input, cb) {
  fs.appendFile(path, input, (err) => {
    if (err) {
      cb(err);
    }
  });
}

function writeToFile(path, input, cb) {
  fs.writeFile(path, input, (err, data) => {
    if (err) {
      logger.error(err);
    } else {
      return cb(data);
    }
  });
}

module.exports = {
  checkDirectory,
  readFile,
  appendToFile,
  writeToFile,
};
