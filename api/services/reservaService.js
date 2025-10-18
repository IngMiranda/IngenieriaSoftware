const Logger = require('../utils/Logger');
const validatorUtil = require('../utils/ValidatorUtil');
const QueryHandler = require('../utils/QueryHandler');

/**
 * 
 * @param {number} companyId 
 * @param {string|null} selectDate 
 * @param {number|null} userId 
 * @returns 
 */
exports.getReservas = async (companyId, selectDate = null, userId = null) => {
    
    const finaltDate = selectDate ? ' AND a.reservaDate = ?' : '';
    const userFilter = userId ? ' AND a.userId = ?' : '';

    let sql = `
        select a.id, a.date, a.h_ini, a.h_fin, a.status, b.descri 
        from reservas a, users b 
        where a.userId = b.id and a.companyId = ? ${finaltDate}  ${userId} 
        order by a.reservaTime asc
    `;
    const params = [companyId];
    if (selectDate) params.push(selectDate);
    if (userId) params.push(userId);

    try {
        const reservas = await QueryHandler.execute(sql, params, 'main');
        Logger.info(`Fetched ${reservas.length} reservas for companyId ${companyId} on ${selectDate}`);
        return reservas;
    } catch (error) {
        Logger.error(`Error fetching reservas from database: ${error.message}`);
        throw new Error('Failed to fetch reservas');
    }

};
