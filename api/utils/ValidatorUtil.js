const Logger = require('./Logger');

class ValidatorUtil {

    /**
     * @param {any} input - The input to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    static isNonEmptyString(input) {
        const isValid = typeof input === 'string' && input.trim().length > 0;
        if (!isValid) {
            Logger.warn(`Validation failed: Expected non-empty string but got ${typeof input}`);
        }
        return isValid;
    }

    /**
     * @param {number} input - The input to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    static isNumber(input) {
        const isValid = typeof input === 'number' && !isNaN(input);
        if (!isValid) {
            Logger.warn(`Validation failed: Expected number but got ${typeof input}`);
        }
        return isValid;
    }

    /**
     * @param {string} dateString - The date string to validate
     * @returns {boolean} - True if valid date in YYYY-MM-DD format, false otherwise
     */
    static isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) {
            Logger.warn(`Validation failed: Date string ${dateString} does not match YYYY-MM-DD format`);
            return false;
        }
        const date = new Date(dateString);
        const isValid = date instanceof Date && !isNaN(date);
        if (!isValid) {
            Logger.warn(`Validation failed: Invalid date ${dateString}`);
        }
        return isValid;
    }

}