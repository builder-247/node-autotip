const logger = require('./logger');
const writer = require('./writer');

function initTracker(uuid) {
  writer.checkDirectory(`./stats/${uuid}/`, (err) => {
    if (err) {
      logger.error(err);
    }
  });
}

module.exports = {
  initTracker,
};
