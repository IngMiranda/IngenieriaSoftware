const express = require('express');
const Logger = require('./utils/Logger');
const { getConnection } = require('./config/db');
const cookieParser = require('cookie-parser');
const authController = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT_PROD ?? 3000; // Esto depende de que puertos tengan abiertos en su equipo

app.use(express.json()); // Con esto le damos chance a express de entender JSON
app.use(express.urlencoded({ extended: true })); // Para datos de formularios
app.use(express.static('public')); // Con esto servimos archivos estáticos desde la carpeta 'public'
app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.access_token;
    let data = null;

    req.session = { user: null};
    try {
        data = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
        req.session.user = data ? { UserId: data.UserId, username: data.username } : null;
    } catch (error) {Logger.warn('Invalid token in cookies');}
    next();
})

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' }); // Sera el archivo de entrada al que se accede desde el navegador
});

app.post('/admi/login', async (req, res) => {
    const {username, password, token} = await authController.userLogin(req, res);
    res
        .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
        .sendStatus(200)
        .send({ message: 'Login successful', token, userId });
});

app.post('/admi/register', async (req, res) => {
    const {success, message, userId, username} = await authController.userCreate(req, res);

    if(success) {
        const result = await authController.userLogin(req, res);
        result
        .cookie('token', result.token, { httpOnly: true, secure: true, sameSite: 'Strict' })
        .status(200)
        .json({ message: 'User created and logged in successfully', token: result.token, userId: result.UserId });
    } else {
        res.status(res.statusCode).json({ message, userId, username });
    }
        
});

app.post('/admi/logout', (req, res) => {
    authController.userLogout(req, res);
    res.sendFile('index.html', { root: 'public' });
})

app.get('/api/health', async (req, res) => {
    try {
        const connection = await getConnection();
        if (connection) {
            connection.release();
            res.status(200).json({ status: 'OK', message: 'Database connection successful' });
        } else {
            res.status(500).json({ status: 'Error', message: 'Database connection failed' });
        }
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.listen(PORT, () => {
    //console.log(`Server running on http://localhost:${PORT}`);
    Logger.info(`Server running on http://localhost:${PORT}`);
    getConnection();
})

module.exports = app;