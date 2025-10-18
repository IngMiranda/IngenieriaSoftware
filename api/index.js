const express = require('express');
const Logger = require('./utils/Logger');
const { getConnection } = require('./config/db');
const cookieParser = require('cookie-parser');
const authController = require('./controllers/authController');
const verifyToken = require('./middlewares/verifyToken');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT_PROD ?? 3000; // Esto depende de que puertos tengan abiertos en su equipo

app.use(express.json()); // Con esto le damos chance a express de entender JSON
app.use(express.urlencoded({ extended: true })); // Para datos de formularios
app.use(express.static('public')); // Con esto servimos archivos estáticos desde la carpeta 'public'
app.use(cookieParser());

app.use(verifyToken.verifyToken); // Middleware para verificar token en todas las rutas

/* ##### ROOT ##### */

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' }); // Sera el archivo de entrada al que se accede desde el navegador
});

/* ##### AUTH ROUTES ##### */

app.post('/admi/login', async (req, res) => {
    await authController.userLogin(req, res);
});

app.post('/admi/register', async (req, res) => {
    await authController.userCreate(req, res);    
});

app.post('/admi/logout', (req, res) => {
    authController.userLogout(req, res);
    res.sendFile('index.html', { root: 'public' });
});

app.get('/api/reservas/disponibilidad', (req, res) => {
    res.json({ message: 'Aquí irán las reservas disponibles' });
});

app.get('/api/reservas/usuario', (req, res) => {
    res.json({ message: 'Aquí irán las reservas' });
});

/* ##### HEALTH CHECK ##### */

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