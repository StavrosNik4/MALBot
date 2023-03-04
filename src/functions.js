const malScraper = require("mal-scraper");
const QuickChart = require("quickchart-js");
const winston = require('winston');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log' })
    ]
});

function removeNonAlphanumeric(str) {
    // Remove all non-alphanumeric characters from the string
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = {
    removeNonAlphanumeric,
    logger
}