const jwt = require('jsonwebtoken');
const Logger = require('../utils/Logger');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.headers['authorization'];
    req.user = null;

    if (!token) {
        Logger.info('No access token found in request');
        return next();
        //return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.UserId, username: decoded.username };
    } catch (error) {
        Logger.warn('Invalid access token: ' + error.message);
        //return res.status(401).json({ message: 'Invalid token' });
    }
    next();
};

/* const token = req.cookies.access_token;
    let data = null;

    req.session = { user: null};
    try {
        data = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
        req.session.user = data ? { UserId: data.UserId, username: data.username } : null;
    } catch (error) {Logger.warn('Invalid token in cookies');}
    next(); */
