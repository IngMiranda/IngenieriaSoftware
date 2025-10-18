const Logger = require('../utils/Logger');
const authService = require('../services/authService');

exports.userLogin = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        Logger.warn('Username or password missing in request body');
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const result = await authService.userLogin(username, password);
        if (result.success) {
            // quitar el token del return
            res.cookie('access_token', result.token, 
            { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' })
            .status(200)
            .json({ message: 'Login successful', userId: result.UserId, username: username, token: result.token });

        } else {
            res.status(401).json({ message: result.message });
        }
    } catch (error) {
        Logger.error(`Admin login error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.userCreate = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        Logger.warn('Username or password missing in request body');
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const result = await authService.userCreate(username, password);
        if (result.success) {
            
            res.cookie('access_token', result.token, 
            { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' })
            .status(201)
            .json({ message: 'User created successfully', userId: result.userId, username: username,  token: result.token });

        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        Logger.error(`Admin registration error: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.userLogout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
    Logger.info('User logged out successfully');
}

/* Codigo para comprobar token

const token = req.cookies.access_token;

    if(!token) {
        Logger.info('No access token found in cookies');
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch {
        Logger.warn('Invalid token during logout');
        res.status(400).json({ message: 'Invalid token' });
    }

*/