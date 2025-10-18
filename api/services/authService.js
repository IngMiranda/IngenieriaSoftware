const Logger = require('../utils/Logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QueryHandler = require('../utils/QueryHandler');
require('dotenv').config();

// Cabe aclarar que todo esto hay que modificarlo y completarlo segun lo que nos pase el equipo de DB

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
exports.userLogin = async (username, password) => {
    try {
        const sql = 'SELECT id, username, password_hash, "role" as role FROM Users WHERE username = ?';
        const results = await QueryHandler.execute(sql, [username], 'auth');

        if (results.length === 0) {
            Logger.warn(`User login failed: user ${username} not found`);
            return { success: false, message: 'Invalid username or password' };
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            Logger.warn(`User login failed: incorrect password for user ${username}`);
            return { success: false, message: 'Invalid username or password' };
        }

        const token = jwt.sign(
            { UserId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        Logger.info(`User ${username} logged in successfully`);
        return { success: true, token, UserId: user.id};

    } catch (error) {
        Logger.error(`User login error: ${error.message}`);
        throw new Error('User login failed');
    }
}

/** 
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
exports.userCreate = async (username, password) => {
    try {
        const saltRounds = parseInt(process.env.HASH_ROUNDS);
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const sql = 'insert into Users (username, password_hash) values (?, ?)';
        const result = await QueryHandler.execute(sql, [username, passwordHash], 'auth');
        
        if (result.success) {
            Logger.info(`User ${username} created successfully`);

            const token = jwt.sign(
                { UserId: result.id, username: username, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return { success: true, token, userId: result.insertId.toString() };
        } else {
            Logger.warn(`User creation failed for ${username}`);
            return { success: false, message: 'User creation failed' };
        }

    } catch (error) {
        Logger.error(`User creation error: ${error.message}`);
        throw new Error('User creation failed');
    }
}