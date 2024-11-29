const path = require('path');
const { createLogger, format, transports } = require('winston');

// Define log format
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Absolute path to the logs directory outside of the server folder
const logDir = path.join(__dirname, '..', 'logs'); // Move one directory up to access 'logs' directory

// Create logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Error logs will go into 'error.log'
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), 
    // All logs (info, warn, error) will go into 'combined.log'
    new transports.File({ filename: path.join(logDir, 'combined.log') }) 
  ]
});

// If in development, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), logFormat)
    })
  );
}

module.exports = logger;
