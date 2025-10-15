const Logger = require('./Logger');
const { getConnection } = require('../config/db');

class QueryHandler {

    /**
     * @param {string} sql - The SQL query to execute
     * @param {Array} params - The parameters for the SQL query
     * @param {string} db - The database to use ('auth' or 'main')
     */
    static async execute(sql, params = [], db = 'main') {
        let conn;
        try {
            conn = await getConnection(db);
            const result = await conn.query({
                sql: sql,
                namedPlaceholders: false, // esto para usar solo ?
            }, params);

            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                return result;
            } else {
                return {
                    success: result.affectedRows > 0 ?? result.warningStatus === 0,
                    affectedRows: result.affectedRows,
                    insertId: result.insertId ?? null // esta y la anterior ya nos la da mariadb
                };
            }

        } catch (error) {
            Logger.error(`Database ${db} query error: ${error.message}`);
            throw new Error('Database query failed');
        } finally {
            if (conn) conn.release(); // liberar la conexion
            Logger.info(`Database ${db} connection released`); 
        }
    }
}

module.exports = QueryHandler;