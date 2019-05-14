const {
  addColors, createLogger, format, transports,
} = require('winston');
const config = require('../config');
const util = require('../util/utility');

const levels = {
  levels: {
    error: 0,
    warn: 1,
    game: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    debug: 'cyan',
    info: 'white',
    game: 'green',
    error: 'red',
  },
};
addColors(levels.colors);
const logger = createLogger({
  levels: levels.levels,
  level: 'info',
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${util.removeANSIFormatting(info.message)}`),
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/game.log', level: 'game' }),
  ],
});

logger.add(new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
}));

if (config.NODE_ENV === 'development') {
  logger.level = 'debug';
  logger.add(new transports.File({ filename: 'logs/debug.log' }));
}

module.exports = logger;
