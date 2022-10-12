const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({
        timestamp: new Date().toISOString(),
        colorize: true,
    })],
});

module.exports = logger;