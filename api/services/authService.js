// Esto solo sera un ejemplo para mi yo del futuro para la autenticacion y de como se usa la Base de Datos Doble

const QueryHandler = require('../utils/QueryHandler');

async function createUser(userData) {
    const { username, password } = userData;

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const params = [username, password];

    const result = await QueryHandler.execute(sql, params, 'auth');

    if (result.success) {
        return { userId: result.insertId, message: 'Usuario creado Successfullmente' };
    }
    throw new Error('Error al crear el usuario');
}

module.exports = { createUser };