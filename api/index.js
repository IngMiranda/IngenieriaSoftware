const express = require('express');
const Logger = require('./utils/Logger');
const { getConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000; // Esto depende de que puertos tengan abiertos en su equipo

app.use(express.json()); // Con esto le damos chance a express de entender JSON
app.use(express.urlencoded({ extended: true })); // Para datos de formularios
app.use(express.static('public')); // Con esto servimos archivos estáticos desde la carpeta 'public'

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' }); // Sera el archivo de entrada al que se accede desde el navegador
});

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