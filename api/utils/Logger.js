const fs = require('fs');
const path = require('path');

const LOG_FILE_PATH = path.join(__dirname, '../../logs/process.log');

class Logger {

    /**
     * @param {string} message - The message to log
     * @param {string} level - The log level (e.g., 'INFO', 'ERROR', 'WARN')
     */
    static print(message, level = 'INFO') {
        const timeStamp = new Date().toLocaleDateString('es-MX', {timeZone: 'America/Mexico_City', hour12: false});
        const logMessage = `[${timeStamp}] [${level.toUpperCase()}] ${message} \n`;

        fs.appendFile(LOG_FILE_PATH, logMessage, (e) => {
            if (e) console.error('Error writing to log file:', e);
        });
    }

    static info(message) {
        this.print(message, 'INFO');
    }

    static error(message) {
        this.print(message, 'ERROR');
    }

    static warn(message) {
        this.print(message, 'WARN');
    }
}

if (!fs.existsSync(path.join(__dirname, '../../logs'))) {
    fs.mkdirSync(path.join(__dirname, '../../logs'));
}

module.exports = Logger;