const { LOG_CONSOLE } = require('config');
const { createLogger, format, transports } = require('winston');

const logFormat = format.printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const createLoggerWrapper = (label) => {
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.label({ label }),
      format.timestamp(),
      logFormat,
    ),
    transports: [
      new transports.File({ filename: '../../logs/error.log', level: 'error' }),
      new transports.File({ filename: '../../logs/combined.log' }),
    ],
  });
  if (LOG_CONSOLE) {
    logger.add(new transports.Console({
      format: format.simple(),
    }));
  }
  return logger;
};

module.exports = {
  createLogger: createLoggerWrapper,
};
