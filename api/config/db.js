const Logger = require('../utils/Logger');
const mariadb = require('mariadb');
require('dotenv').config();

const authPool = mariadb.createPool({
    host: process.env.HOST_DB_AUTH_DEV ?? process.env.HOST_DB_AUTH_PROD,
    user: process.env.USER_DB_AUTH_DEV ?? process.env.USER_DB_AUTH_PROD,
    password: process.env.PASSWORD_DB_AUTH_DEV ?? process.env.PASSWORD_DB_AUTH_PROD,
    database: process.env.NAME_DB_AUTH_DEV ?? process.env.NAME_DB_AUTH_PROD,
    connectionLimit: 5
});

const mainPool = mariadb.createPool({
    host: process.env.HOST_DB_MAIN_DEV ?? process.env.HOST_DB_MAIN_PROD,
    user: process.env.USER_DB_MAIN_DEV ?? process.env.USER_DB_MAIN_PROD,
    password: process.env.PASSWORD_DB_MAIN_DEV ?? process.env.PASSWORD_DB_MAIN_PROD,
    database: process.env.NAME_DB_MAIN_DEV ?? process.env.NAME_DB_MAIN_PROD,
    connectionLimit: 5
});

/**
* @param {string} poolName - 'auth' or 'main'
* @returns {Promise<object>} - MariaDB connection
*/

async function getConnection (poolName) {
    const pool = poolName === 'auth' ? authPool : mainPool;
    const dbName = poolName === 'auth' ? 
        process.env.NAME_DB_AUTH_DEV  ?? process.env.NAME_DB_AUTH_PROD 
        : process.env.NAME_DB_MAIN_DEV ?? process.env.NAME_DB_MAIN_PROD;

    Logger.info(`Try connection to database: ${dbName}`);
    try {
        const conn = await pool.getConnection();
        Logger.info(`Connected to database: ${dbName}`);
        return conn;
    } catch (error) {
        Logger.error(`Database connection error: ${error.message}`);
        throw new Error(`Database connection failed ${poolName}`);
    }
}

module.exports = { getConnection };