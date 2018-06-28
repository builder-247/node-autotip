const logger = require('./logger');
const writer = require('./writer');

let uuid;
let tracker = {
  tips: 1,
};
function initTracker(_uuid) {
  uuid = _uuid;
  writer.checkDirectory(`./stats/${uuid}/`, (err) => {
    if (err) {
      logger.error(err);
    }
    writer.readFile(`./stats/${uuid}/tips.json`, (data) => {
      if (data) {
        tracker = JSON.parse(data);
      }
    });
  });
}

function tipIncrement() {
  tracker.tips += 1;
  writer.writeToFile(`./stats/${uuid}/tips.json`, JSON.stringify(tracker), () => {});
}

function getTipCount() {
  return tracker.tips;
}

module.exports = {
  initTracker,
  tipIncrement,
  getTipCount,
};
